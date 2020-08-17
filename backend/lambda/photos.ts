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

    const { Items } = await dynamo
      .query({
        TableName: tableName,
        IndexName: "GSI1",
        ProjectionExpression: "Id, Caption, Width, Height",
        KeyConditionExpression:
          "GSI1PK = :gsi1pk AND begins_with(GSI1SK, :prefix)",
        Limit: take,
        ExclusiveStartKey: cursor
          ? {
              SK: `ID#${year}/${cursor}`,
              PK: `ID#${year}/${cursor}`,
              GSI1PK: "OBJECTS",
              GSI1SK: `ID#${year}/${cursor}`,
            }
          : undefined,
        ExpressionAttributeValues: {
          ":gsi1pk": "OBJECTS",
          ":prefix": year ? `ID#${year}/` : "ID#",
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
      cursor: Items && Items[take - 1]?.Id,
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
    }
  }
}

exports.handler = photosLambda
