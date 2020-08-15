import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { S3 } from "aws-sdk"
import * as sharp from "sharp"
import * as z from "zod"

const bucketName = process.env.BUCKET_NAME
const s3 = new S3()

const schema = z
  .object({ q: z.string(), w: z.string(), h: z.string() })
  .partial()
  .optional()

const imageTransformHandler: APIGatewayProxyHandlerV2 = async ({
  queryStringParameters,
  headers,
  pathParameters,
}) => {
  try {
    if (!pathParameters) {
      return {
        statusCode: 404,
      }
    }

    const params = {
      Bucket: bucketName,
      Key: pathParameters.image,
    }

    let { ContentType: contentType } = await s3.headObject(params).promise()
    if (!contentType) throw Error

    if (!schema.check(queryStringParameters)) {
      return {
        statusCode: 400,
      }
    }

    const { q, w, h } = queryStringParameters ?? {}
    const quality = q ? parseInt(q) : 75
    const width = w ? parseInt(w) : undefined
    const height = h ? parseInt(h) : undefined

    let pipeline = sharp()
    pipeline = pipeline.resize({ width, height })

    if (headers.accept.includes("image/webp") && contentType !== "image/webp") {
      pipeline = pipeline.webp({ quality })
      contentType = "image/webp"
    } else {
      const [, format] = contentType.split("/")
      pipeline = pipeline.toFormat(format, { quality })
    }

    const image = await s3
      .getObject(params)
      .createReadStream()
      .pipe(pipeline)
      .toBuffer()

    return {
      statusCode: 200,
      headers: { "Content-Type": contentType },
      body: image.toString("base64"),
      isBase64Encoded: true,
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500 }
  }
}

exports.handler = imageTransformHandler
