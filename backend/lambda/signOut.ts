import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { getRefreshToken } from "../utils/getRefreshToken"

const tableName = process.env.TABLE_NAME
const dynamo = new DynamoDB.DocumentClient()

const signOutHandler: APIGatewayProxyHandlerV2 = async ({ cookies }) => {
  try {
    const refreshToken = getRefreshToken(cookies)

    if (!refreshToken) {
      return {
        statusCode: 401,
      }
    }

    await dynamo
      .delete({
        TableName: tableName,
        Key: { SK: "REFRESH#" + refreshToken, PK: "REFRESH#" + refreshToken },
      })
      .promise()
    return {
      statusCode: 200,
      cookies: ["refreshToken=; Max-Age=0"],
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
    }
  }
}

exports.handler = signOutHandler
