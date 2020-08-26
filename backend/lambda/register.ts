import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB, SES } from "aws-sdk"
import { nanoid } from "nanoid"
import * as z from "zod"

const tableName = process.env.TABLE_NAME
const authTableName = process.env.AUTH_TABLE_NAME
const year = process.env.YEAR
const baseUrl = process.env.BASE_URL
const maxParticipants = process.env.MAX_PARTICIPANTS

const dynamo = new DynamoDB.DocumentClient()
const ses = new SES()

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
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
  mobile: z.string(),
  email: z.string().email(),
  eatingHabits: z.string(),
  foodIntolerances: z.string().optional(),
  canSwim: z.boolean(),
  supervision: z.boolean(),
  diseases: z.string().optional(),
  allergies: z.string().optional(),
  medication: z.string().optional(),
  familyDoctorName: z.string().optional(),
  familyDoctorPhone: z.string().optional(),
  healthInsurance: z.string().optional(),
})

function parseData(body: string | undefined) {
  try {
    if (!body) throw Error
    const data = schema.parse(JSON.parse(body))
    const [day, month, year] = data.birthDate.split(".")
    const birthDate = new Date(`${month}/${day}/${year}`).toISOString()
    return { ...data, birthDate }
  } catch {
    return undefined
  }
}

const registerHandler: APIGatewayProxyHandlerV2 = async ({ body }) => {
  try {
    const data = parseData(body)
    console.log(data)
    if (!data) return { statusCode: 400 }

    const [{ Item }, { Items }] = await Promise.all([
      dynamo
        .get({
          TableName: tableName,
          Key: { PK: `REGISTRATIONS#${year}`, SK: "COUNT" },
          ProjectionExpression: "#count",
          ExpressionAttributeNames: {
            "#count": "count",
          },
        })
        .promise(),
      dynamo
        .query({
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
        })
        .promise(),
    ])

    const count = Item?.count ?? 0

    let transactItems: any = [
      {
        Put: {
          TableName: tableName,
          Item: {
            PK: `REGISTRATIONS#${year}`,
            SK: `REGISTRATION#${count + 1}`,
            id: count + 1,
            year,
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
            PK: `REGISTRATIONS#${year}`,
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
                (role: string) => role === `PARTICIPANT#${year}`,
              )
                ? []
                : [`PARTICIPANT#${year}`],
            },
          },
        },
      ]
    } else {
      const userId = nanoid()
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
              roles: [`PARTICIPANT#${year}`],
              email: data.email,
            },
          },
        },
      ]
    }

    await Promise.all([
      dynamo
        .transactWrite({
          TransactItems: transactItems,
        })
        .promise(),
      ses
        .sendTemplatedEmail({
          Destination: {
            ToAddresses: [data.email],
          },
          Template:
            count < parseInt(maxParticipants)
              ? "registrationSuccessful"
              : "registrationWaitinglist",
          TemplateData: JSON.stringify({
            Vorname: data.firstName,
            Nachname: data.lastName,
          }),
          Source: `Zeltlager Wittlich <mail@${baseUrl}>`,
        })
        .promise(),
    ])
    return {
      status: count < parseInt(maxParticipants) ? "success" : "waiting",
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
    }
  }
}

exports.handler = registerHandler
