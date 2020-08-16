import { ComputerVisionClient } from "@azure/cognitiveservices-computervision"
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js"
import { S3Handler } from "aws-lambda"
import { DynamoDB, Rekognition, S3, Translate } from "aws-sdk"

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
  const key = Records[0].s3.object.key
  const eventName = Records[0].eventName

  if (eventName.includes("ObjectCreated")) {
    const params = {
      Bucket: Records[0].s3.bucket.name,
      Key: key,
    }

    const [{ ContentType: contentType }, url] = await Promise.all([
      s3.headObject(params).promise(),
      s3.getSignedUrlPromise("getObject", params),
    ])

    const [{ FaceRecords }, { captions }] = await Promise.all([
      rekognition
        .indexFaces({
          Image: {
            S3Object: params,
          },
          CollectionId: "TentCamp",
        })
        .promise(),
      computerVision.describeImage(url, { language: "en" }),
    ])

    let caption: string | undefined
    if (captions && captions[0].text) {
      const { TranslatedText } = await translate
        .translateText({
          SourceLanguageCode: "en",
          TargetLanguageCode: "de",
          Text: captions[0].text,
        })
        .promise()
      caption = TranslatedText
    }

    await dynamo
      .put({
        TableName: tableName,
        Item: {
          PK: "KEY#" + key,
          SK: "KEY#" + key,
          GSI1PK: "OBJECTS",
          GSI1SK: "KEY#" + key,
          ContentType: contentType,
          Caption: caption,
          Faces: FaceRecords?.map(({ Face }) => Face),
        },
        ConditionExpression: "attribute_not_exists(PK)",
      })
      .promise()
  }

  if (eventName.includes("ObjectRemoved")) {
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
