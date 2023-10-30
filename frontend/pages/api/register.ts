import { isValidNumberForRegion, parsePhoneNumber } from "libphonenumber-js"
import type { NextApiRequest, NextApiResponse } from "next"
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"
import {
  DynamoDBDocument,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import * as z from "zod"
import { id } from "utils/id"
import { config } from "project.config"

const tableName = process.env.TABLE_NAME
const authTableName = process.env.AUTH_TABLE_NAME

const successfulRegistration = ({
  firstName,
  lastName,
}: {
  firstName: string
  lastName: string
}) => ({
  subject: `Anmeldung für das Zeltlager ${config.year} war erfolgreich`,
  body: `Vielen Dank für die Anmeldung!\n\n${firstName} ist jetzt bei uns auf der Anmeldeliste und wir freuen uns jetzt schon auf die gemeinsamen Tage im Zeltlager. Alle weiteren Informationen werden wir an diese Email-Adresse senden.\n\nUm die Anmeldung abzuschließen, überweist bitte den Teilnehmendenbeitrag von ${
    config.maxParticipationFee
  }-${config.maxParticipationFee}€ (${config.reducedMinParticipationFee}-${
    config.reducedMaxParticipationFee
  }€ für Geschwisterkinder; 11€ weniger für KjG - Mitglieder) an:\n\nZeltlager Wittlich\nIBAN: ${
    config.iban
  }\nBetreff: “Zeltlager ${firstName} ${lastName}”\n\nAls nächstes werden Sie voraussichtlich Anfang Juli {{year}} fehlende Informationen erhalten und zum Elternabend eingeladen werden.\n\nBis dahin noch eine gute Zeit und bleiben Sie gesund!\n\n${config.leadershipMembers.join(
    ",\n",
  )}\nund das gesamte Zeltlagerteam`,
})

const waitingList = () => ({
  subject: `Anmeldung für die ${config.shortName} ${config.year} auf der Warteliste`,
  body: `Vielen Dank für dein Interesse!\n\nLeider sind wir für dieses Jahr schon ausgebucht und können keine Anmeldungen mehr entgegennehmen. Wir haben dich aber trotzdem auf die Warteliste gesetzt. Falls jemand abspringt oder wir doch noch mehr Teilnehmende mitnehmen können, melden wir uns bei dir.\n\nWir hoffen euch noch Bescheid sagen zu können und wünschen bis dahin alles Gute!\n\n${config.leadershipMembers.join(
    ",\n",
  )}\nund das gesamte ${config.shortName}team`,
})

const credentials = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
}

const dynamo = DynamoDBDocument.from(new DynamoDBClient(credentials))
const ses = new SESClient(credentials)

const PhoneNumber = z
  .string()
  .refine((s) => isValidNumberForRegion(s, "DE"))
  .transform((s) => parsePhoneNumber(s, "DE").formatNational())

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(["M", "W", "D"]),
  birthDate: z.string().refine((value) => {
    const [day, month, year] = value.split(".")
    if (new Date(`${month}/${day}/${year}`).getTime()) {
      return true
    }
    return false
  }),
  streetAddress: z.string(),
  postalCode: z.string(),
  city: z.string(),
  phoneNumbers: z.array(z.string()),
  email: z.string().email(),
  eatingHabits: z.string(),
  foodIntolerances: z.string().optional(),
  canSwim: z.boolean(),
  supervision: z.boolean(),
  firstAid: z.boolean(),
  diseases: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.array(z.string()),
  familyDoctorName: z.string(),
  familyDoctorPhone: z.string(),
  healthInsurance: z.string(),
  groupWith: z.string().optional(),
  kjgMember: z.boolean().optional(),
})

function parseData(body: unknown) {
  try {
    if (!body) throw Error
    const data = schema.parse(body)
    const [day, month, year] = data.birthDate.split(".")
    const birthDate = new Date(`${month}/${day}/${year}`).toISOString()
    return { ...data, birthDate }
  } catch (error) {
    console.log(error)
    return
  }
}

type ResponseData = {
  status: "success" | "waiting"
}

export default async (
  { body }: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  try {
    const data = parseData(body)
    console.log(data)
    if (!data) return res.status(400).end()

    const [{ Item }, { Items }] = await Promise.all([
      dynamo.send(
        new GetCommand({
          TableName: tableName,
          Key: { PK: `REGISTRATIONS#${config.year}`, SK: "COUNT" },
          ProjectionExpression: "#count",
          ExpressionAttributeNames: {
            "#count": "count",
          },
        }),
      ),
      dynamo.send(
        new QueryCommand({
          TableName: authTableName,
          IndexName: "GSI1",
          ProjectionExpression: "PK, SK, #roles, userId",
          KeyConditionExpression: "GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk",
          ExpressionAttributeNames: {
            "#roles": "roles",
          },
          ExpressionAttributeValues: {
            ":gsi1pk": "EMAIL#" + data.email,
            ":gsi1sk": "PROFILE",
          },
        }),
      ),
    ])

    const count = Item?.count ?? 0

    const registrationId = id()

    let transactItems: any = [
      {
        Put: {
          TableName: tableName,
          Item: {
            PK: `REGISTRATIONS#${config.year}`,
            SK: `REGISTRATION#${registrationId}`,
            registrationId,
            year: config.year,
            type: "REGISTRATION",
            ...data,
          },
          ConditionExpression: "attribute_not_exists(SK)",
        },
      },
      {
        Update: {
          TableName: tableName,
          Key: {
            PK: `REGISTRATIONS#${config.year}`,
            SK: "COUNT",
          },
          UpdateExpression: "ADD #count :incr",
          ExpressionAttributeNames: {
            "#count": "count",
          },
          ExpressionAttributeValues: {
            ":incr": 1,
          },
        },
      },
    ]
    if (Items && Items[0]?.PK && Items[0].SK) {
      transactItems = [
        ...transactItems,
        {
          Update: {
            TableName: authTableName,
            Key: { PK: Items[0].PK, SK: Items[0].SK },
            UpdateExpression: "SET #roles = list_append(:roles, #roles)",
            ExpressionAttributeNames: { "#roles": "roles" },
            ExpressionAttributeValues: {
              ":roles": Items[0].roles.find(
                (role: string) => role === `PARTICIPANT#${config.year}`,
              )
                ? []
                : [`PARTICIPANT#${config.year}`],
            },
          },
        },
      ]
    } else {
      const userId = id()
      transactItems = [
        ...transactItems,
        {
          Put: {
            TableName: authTableName,
            ConditionExpression: "attribute_not_exists(PK)",
            Item: {
              PK: "USER#" + userId,
              SK: "PROFILE",
              GSI1PK: "EMAIL#" + data.email,
              GSI1SK: "PROFILE",
              type: "PROFILE",
              userId,
              roles: [`PARTICIPANT#${config.year}`],
              email: data.email,
            },
          },
        },
      ]
    }

    const status =
      count < config.maxParticipants ? "success" : ("waiting" as const)

    const email =
      status === "success" ? successfulRegistration(data) : waitingList()

    await Promise.all([
      dynamo.send(
        new TransactWriteCommand({
          TransactItems: transactItems,
        }),
      ),
      ses.send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [data.email],
            BccAddresses: [`mail@${config.domain}`],
          },
          Message: {
            Subject: { Data: email.subject },
            Body: { Text: { Data: email.body } },
          },
          Source: `${config.shortName} Wittlich <mail@${config.domain}>`,
        }),
      ),
    ])
    return res.json({ status })
  } catch (err) {
    console.error(err)
    return res.status(500).end()
  }
}
