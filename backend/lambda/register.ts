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
  allergies: z.string().optional(),
  birthDate: z.string().refine((value) => !isNaN(new Date(value).getTime())),
  canSwim: z.boolean(),
  city: z.string(),
  diseases: z.string().optional(),
  eatingHabits: z.string(),
  email: z.string().email(),
  familyDoctorName: z.string(),
  familyDoctorPhone: z.string(),
  firstName: z.string(),
  foodIntolerances: z.string().optional(),
  health: z.string().optional(),
  healthInsurance: z.string(),
  lastName: z.string(),
  mobile: z.string(),
  postalCode: z.string().length(5),
  streetAddress: z.string(),
  supervision: z.boolean(),
})

const registerHandler: APIGatewayProxyHandlerV2 = async ({ body }) => {
  try {
    let data
    try {
      if (!body) throw Error
      data = JSON.parse(body)
      schema.parse(data)
    } catch {
      return {
        statusCode: 400,
      }
    }

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
        .sendEmail({
          Destination: {
            ToAddresses: [data.email],
          },
          Message: {
            Body: {
              Html: {
                Data: count < parseInt(maxParticipants) ? "success" : "waiting",
              },
              Text: {
                Data: count < parseInt(maxParticipants) ? "success" : "waiting",
              },
            },
            Subject: {
              Data: count < parseInt(maxParticipants) ? "success" : "waiting",
            },
          },
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
