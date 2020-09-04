import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB, SES } from "aws-sdk"
import { nanoid } from "nanoid"
import * as z from "zod"

const tableName = process.env.TABLE_NAME
const baseUrl = process.env.BASE_URL

const dynamo = new DynamoDB.DocumentClient()
const ses = new SES()

const schema = z.object({
  email: z.string().email(),
})

async function getUserIdByEmail(email: string) {
  const { Items } = await dynamo
    .query({
      TableName: tableName,
      IndexName: "GSI1",
      ProjectionExpression: "userId",
      KeyConditionExpression: "GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk",
      ExpressionAttributeValues: {
        ":gsi1pk": "EMAIL#" + email,
        ":gsi1sk": "PROFILE",
      },
    })
    .promise()
  if (Items && Items[0]?.userId) return Items[0].userId
  return undefined
}

const signInHandler: APIGatewayProxyHandlerV2 = async ({ body }) => {
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

    const [refreshToken, confirm, tokenId] = [nanoid(), nanoid(), nanoid()]

    const userId = await getUserIdByEmail(data.email)

    if (!userId) return { statusCode: 404 }

    await Promise.all([
      dynamo
        .put({
          TableName: tableName,
          Item: {
            PK: "TOKEN#" + refreshToken,
            SK: "TOKEN#" + refreshToken,
            GSI1PK: "ID#" + tokenId,
            GSI1SK: "CREATED_AT#" + Date.now(),
            GSI2PK: "CONFIRM#" + confirm,
            GSI2SK: "CREATED_AT#" + Date.now(),
            type: "REFRESH_TOKEN",
            expiresAt: Math.round(Date.now() / 1000) + 600,
            refreshToken: refreshToken,
            userId,
            confirmed: false,
          },
        })
        .promise(),
      ses
        .sendEmail({
          Destination: {
            ToAddresses: [data.email],
          },
          Message: {
            Body: {
              Text: {
                Data: `https://${baseUrl}/bestaetigen/${confirm}`,
              },
            },
            Subject: {
              Data: "Anmeldung bestätigen",
            },
          },
          Source: `Zeltlager Wittlich <mail@${baseUrl}>`,
        })
        .promise(),
    ])

    return { tokenId }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
    }
  }
}

exports.handler = signInHandler
