import { S3Handler } from "aws-lambda"
import { DynamoDB } from "aws-sdk"

const tableName = process.env.TABLE_NAME

const dynamo = new DynamoDB.DocumentClient()

const objectRemovedHandler: S3Handler = async ({ Records }) => {
  const key = Records[0].s3.object.key

  const { Items } = await dynamo
    .query({
      TableName: tableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk",
      ProjectionExpression: "PK, SK",
      ExpressionAttributeValues: {
        ":gsi1pk": "OBJECTS",
        ":gsi1sk": "KEY#" + key,
      },
    })
    .promise()

  if (Items && Items[0].PK && Items[0].SK) {
    await dynamo
      .delete({
        TableName: tableName,
        Key: {
          PK: Items[0].PK,
          SK: Items[0].SK,
        },
        ConditionExpression: "attribute_exists(PK)",
      })
      .promise()
  }
}

exports.handler = objectRemovedHandler
