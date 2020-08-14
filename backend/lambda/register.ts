import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB } from "aws-sdk"

const tableName = process.env.TABLE_NAME
const year = process.env.YEAR
const maxParticipants = process.env.MAX_PARTICIPANTS
const dynamo = new DynamoDB.DocumentClient()

const registerHandler: APIGatewayProxyHandlerV2 = async () => {
  try {
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
    await dynamo
      .transactWrite({
        TransactItems: [
          {
            Put: {
              Item: {
                PK: `REGISTRATIONS#${year}`,
                SK: `REGISTRATION#${count + 1}`,
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
      .promise()
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
