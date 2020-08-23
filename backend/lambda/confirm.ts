import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB } from "aws-sdk"

const tableName = process.env.TABLE_NAME
const dynamo = new DynamoDB.DocumentClient()

const confirmHandler: APIGatewayProxyHandlerV2 = async ({ body }) => {
  try {
    if (!body) return { statusCode: 400 }
    const { confirm } = JSON.parse(body)
    if (typeof confirm !== "string") return { statusCode: 400 }
    const { Items } = await dynamo
      .query({
        TableName: tableName,
        IndexName: "GSI2",
        ProjectionExpression: "PK, SK",
        KeyConditionExpression: "GSI2PK = :pk AND GSI2SK < :sk",
        ExpressionAttributeValues: {
          ":pk": "CONFIRM#" + confirm,
          ":sk": "CREATED_AT#" + (Date.now() + 600),
        },
      })
      .promise()
    if (!(Items && Items[0].PK && Items[0].SK)) return { statusCode: 400 }
    const { PK, SK } = Items[0]
    await dynamo
      .update({
        TableName: tableName,
        Key: { PK, SK },
        UpdateExpression: "SET confirmed = :true REMOVE expiresAt",
        ExpressionAttributeValues: { ":true": true },
      })
      .promise()
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
    }
  }
}

exports.handler = confirmHandler
