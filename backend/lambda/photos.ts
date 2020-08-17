import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import * as z from "zod"

const tableName = process.env.TABLE_NAME
const baseUrl = process.env.BASE_URL
const dynamo = new DynamoDB.DocumentClient()

const schema = z.object({
  year: z.string().optional(),
  cursor: z.string().optional(),
  take: z.string().optional(),
})

const photosLambda: APIGatewayProxyHandlerV2 = async ({
  queryStringParameters,
}) => {
  try {
    const { cursor, take: takeString, year } = schema.parse(
      queryStringParameters ?? {},
    )
    const take = takeString ? parseInt(takeString) : 10

    let item
    if (cursor) {
      const { Item } = await dynamo
        .get({
          TableName: tableName,
          Key: { PK: "ID#" + cursor, SK: "ID#" + cursor },
          ProjectionExpression: "PK, SK, GSI1PK, GSI1SK",
        })
        .promise()
      item = Item
    }

    const { Items } = await dynamo
      .query({
        TableName: tableName,
        IndexName: "GSI1",
        ProjectionExpression: "Id, Caption, Width, Height",
        KeyConditionExpression:
          "GSI1PK = :gsi1pk AND begins_with(GSI1SK, :prefix)",
        Limit: take,
        ExclusiveStartKey: item && {
          SK: item.SK,
          PK: item.PK,
          GSI1SK: item.GSI1SK,
          GSI1PK: item.GSI1PK,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": "OBJECTS",
          ":prefix": year ? `KEY#${year}/` : "KEY#",
        },
      })
      .promise()

    return {
      photos: Items?.map(
        ({ Id: id, Caption: alt, Width: width, Height: height }) => ({
          key: id,
          src: baseUrl + id,
          alt,
          width,
          height,
        }),
      ),
      cursor: Items && Items[take - 1].Id,
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
    }
  }
}

exports.handler = photosLambda
