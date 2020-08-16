import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDB, S3 } from "aws-sdk"
import * as sharp from "sharp"
import * as z from "zod"

const bucketName = process.env.BUCKET_NAME
const tableName = process.env.TABLE_NAME

const s3 = new S3()
const dynamo = new DynamoDB.DocumentClient()

const schema = z
  .object({
    w: z.string(),
    h: z.string(),
    q: z.string(),
  })
  .partial()

const imageTransformHandler: APIGatewayProxyHandlerV2 = async ({
  queryStringParameters,
  headers,
  pathParameters,
}) => {
  try {
    if (!pathParameters?.path) {
      return {
        statusCode: 404,
      }
    }

    const { path } = pathParameters

    const { Item } = await dynamo
      .get({
        TableName: tableName,
        Key: { PK: "KEY#" + path, SK: "KEY#" + path },
        ProjectionExpression: "ContentType",
      })
      .promise()

    if (!Item) {
      return {
        statusCode: 404,
      }
    }

    const { w, h, q } = schema.parse(queryStringParameters ?? {})
    const quality = q ? parseInt(q) : 75
    const width = w ? parseInt(w) : undefined
    const height = h ? parseInt(h) : undefined

    let pipeline = sharp()

    if (width || height) {
      pipeline = pipeline.resize({ width, height })
    }

    let contentType = Item.ContentType

    if (headers.accept.includes("image/webp") && contentType !== "image/webp") {
      pipeline = pipeline.webp({ quality })
      contentType = "image/webp"
    } else {
      const [, format] = contentType.split("/")
      pipeline = pipeline.toFormat(format, { quality })
    }

    const image = await s3
      .getObject({
        Bucket: bucketName,
        Key: path,
      })
      .createReadStream()
      .pipe(pipeline)
      .toBuffer()

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
      body: image.toString("base64"),
      isBase64Encoded: true,
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500 }
  }
}

exports.handler = imageTransformHandler
