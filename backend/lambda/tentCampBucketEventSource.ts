import { S3Handler } from "aws-lambda"
import { DynamoDB, Rekognition } from "aws-sdk"

const tableName = process.env.TABLE_NAME

const rekognition = new Rekognition()
const dynamo = new DynamoDB.DocumentClient()

const tentCampBucketEventSource: S3Handler = async ({ Records }) => {
  const key = Records[0].s3.object.key

  if (Records[0].eventName.includes("ObjectCreated")) {
    const params = {
      Image: {
        S3Object: {
          Bucket: Records[0].s3.bucket.name,
          Name: Records[0].s3.object.key,
        },
      },
    }

    const [{ FaceRecords }, { Labels }] = await Promise.all([
      rekognition.indexFaces({ ...params, CollectionId: "TentCamp" }).promise(),
      rekognition.detectLabels(params).promise(),
    ])

    await dynamo
      .put({
        TableName: tableName,
        Item: {
          PK: "KEY#" + key,
          SK: "KEY#" + key,
          GSI1PK: "OBJECTS",
          GSI1SK: "KEY#" + key,
          alt: Labels?.map(({ Name }) => Name).join(" "),
          faces: FaceRecords?.map(({ Face }) => Face),
        },
        ConditionExpression: "attribute_not_exists(PK)",
      })
      .promise()
  }

  if (Records[0].eventName.includes("ObjectRemoved")) {
    await dynamo
      .delete({
        TableName: tableName,
        Key: {
          PK: "KEY#" + key,
          SK: "KEY#" + key,
        },
        ConditionExpression: "attribute_exists(PK)",
      })
      .promise()
  }
}

exports.handler = tentCampBucketEventSource
