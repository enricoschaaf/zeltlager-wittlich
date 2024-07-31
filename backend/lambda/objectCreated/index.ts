import { ComputerVisionClient } from "@azure/cognitiveservices-computervision"
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js"
import { S3Handler } from "aws-lambda"
import { DynamoDB, Rekognition, S3, Translate } from "aws-sdk"
import { id as identifier } from "utils/id"
import { dirname } from "path"
import sharp = require("sharp")

const tableName = process.env.TABLE_NAME
const computerVisionKey = process.env.COMPUTER_VISION_KEY
const computerVisionEndPoint = process.env.COMPUTER_VISION_ENDPOINT

const rekognition = new Rekognition()
const dynamo = new DynamoDB.DocumentClient()
const s3 = new S3()
const translate = new Translate()
const cognitiveServiceCredentials = new CognitiveServicesCredentials(
  computerVisionKey,
)
const computerVision = new ComputerVisionClient(
  cognitiveServiceCredentials,
  computerVisionEndPoint,
)

const tentCampBucketEventSource: S3Handler = async ({ Records }) => {
  const bucketName = Records[0].s3.bucket.name
  const key = Records[0].s3.object.key
  const path = dirname(Records[0].s3.object.key)
  const id = identifier()

  const params = {
    Bucket: bucketName,
    Key: key,
  }

  const getMetadata = new Promise<{
    contentType?: string
    width?: number
    height?: number
  }>(async (resolve, reject) => {
    const { Body: image, ContentType: contentType } = await s3
      .getObject(params)
      .promise()
    if ((Buffer.isBuffer(image) || typeof image === "string") && contentType) {
      const { width, height } = await sharp(image).metadata()
      resolve({ contentType, width, height })
    }
    reject()
  })

  const getCaption = new Promise<{ caption?: string }>(async (resolve) => {
    const url = await s3.getSignedUrlPromise("getObject", params)
    const { captions } = await computerVision.describeImage(url, {
      language: "en",
    })
    if (captions && captions[0]?.text) {
      const { TranslatedText } = await translate
        .translateText({
          SourceLanguageCode: "en",
          TargetLanguageCode: "de",
          Text: captions[0].text,
        })
        .promise()
      resolve({ caption: TranslatedText })
    }
    resolve({ caption: undefined })
  })

  const getFaces = rekognition
    .indexFaces({
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: key,
        },
      },
      CollectionId: "TentCamp",
    })
    .promise()

  const [{ contentType, width, height }, { caption }, { FaceRecords }] =
    await Promise.all([getMetadata, getCaption, getFaces])

  await dynamo
    .put({
      TableName: tableName,
      Item: {
        PK: `ID#${path}/${id}`,
        SK: `ID#${path}/${id}`,
        GSI1PK: "OBJECTS",
        GSI1SK: `ID#${path}/${id}`,
        Id: `${path}/${id}`,
        Key: key,
        Width: width,
        Height: height,
        ContentType: contentType,
        Caption: caption,
        Faces: FaceRecords?.map(({ Face }) => Face),
      },
      ConditionExpression: "attribute_not_exists(PK)",
    })
    .promise()
}

exports.handler = tentCampBucketEventSource
