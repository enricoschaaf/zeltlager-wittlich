import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { verify } from "jsonwebtoken"
import { getAccessToken } from "../utils/getAccessToken"

const tableName = process.env.TABLE_NAME
const publicKey = process.env.PUBLIC_KEY
const dynamo = new DynamoDB.DocumentClient()

const profileHandler: APIGatewayProxyHandlerV2 = async ({ headers }) => {
  try {
    const { accessToken } = getAccessToken(headers)
    if (!accessToken) return { statusCode: 401 }
    const { userId }: any = verify(accessToken, publicKey)

    const { Item } = await dynamo
      .get({
        TableName: tableName,
        ProjectionExpression: "email",
        Key: { PK: "USER#" + userId, SK: "PROFILE" },
      })
      .promise()

    if (!Item?.email) return { statusCode: 404 }
    return { email: Item.email }
  } catch (err) {
    console.error(err)
    return { statusCode: 500 }
  }
}

exports.handler = profileHandler
