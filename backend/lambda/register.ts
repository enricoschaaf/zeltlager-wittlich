import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB, SES } from "aws-sdk"
import * as z from "zod"

const tableName = process.env.TABLE_NAME
const year = process.env.YEAR
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
    const { Item } = await dynamo
      .get({
        TableName: tableName,
        Key: { PK: `REGISTRATIONS#${year}`, SK: "COUNT" },
        ProjectionExpression: "#count",
        ExpressionAttributeNames: {
          "#count": "count",
        },
      })
      .promise()
    const count = Item?.count ?? 0
    await Promise.all([
      dynamo
        .transactWrite({
          TransactItems: [
            {
              Put: {
                Item: {
                  PK: `REGISTRATIONS#${year}`,
                  SK: `REGISTRATION#${count + 1}`,
                  ...data,
                },
                TableName: tableName,
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
          ],
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
          Source: "Zeltlager Wittlich <noreply@zeltlager-wittlich.de>",
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
