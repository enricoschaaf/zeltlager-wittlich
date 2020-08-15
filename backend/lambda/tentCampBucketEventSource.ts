import { S3EventRecord, S3Handler } from "aws-lambda"
import { DynamoDB, Rekognition } from "aws-sdk"

const tableName = process.env.TABLE_NAME

const rekognition = new Rekognition()
const dynamo = new DynamoDB.DocumentClient()

const tentCampBucketEventSource: S3Handler = async ({ Records }) => {
  let createRecords: S3EventRecord[] = []
  let deleteRecords: S3EventRecord[] = []

  Records.map((record) => {
    if (record.eventName.includes("ObjectCreated")) {
      createRecords.push(record)
    }
    if (record.eventName.includes("ObjectRemoved")) {
      deleteRecords.push(record)
    }
  })

  const dataArray = await Promise.all(
    createRecords.map(({ s3: { bucket, object } }) => {
      const params = {
        Image: {
          S3Object: { Bucket: bucket.name, Name: object.key },
        },
      }
      return Promise.all([
        rekognition.detectFaces(params).promise(),
        rekognition.detectLabels(params).promise(),
      ])
    }),
  )

  const createRequests = dataArray.map(([{ FaceDetails }, { Labels }], i) => {
    const [folder, key] = createRecords[i].s3.object.key.split("/")
    return {
      PutRequest: {
        Item: {
          PK: "FOLDER#" + folder,
          SK: "KEY" + key,
          alt: Labels?.map(({ Name }) => Name).join(" "),
          boundingBox: FaceDetails?.map(({ BoundingBox }) => BoundingBox),
        },
      },
    }
  })

  const deleteRequests = deleteRecords.map(({ s3: { object } }) => {
    const [folder, key] = object.key.split("/")
    return {
      DeleteRequest: {
        Key: {
          PK: "FOLDER#" + folder,
          SK: "KEY" + key,
        },
      },
    }
  })

  await dynamo
    .batchWrite({
      RequestItems: {
        [tableName]: [...createRequests, ...deleteRequests],
      },
    })
    .promise()
}

exports.handler = tentCampBucketEventSource
