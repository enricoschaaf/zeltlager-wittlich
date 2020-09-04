import { Handler } from "aws-lambda"
import { DynamoDB, S3, SES } from "aws-sdk"
import { createHash } from "crypto"
import { simpleParser } from "mailparser"
import { createTransport } from "nodemailer"

const bucketName = process.env.BUCKET_NAME
const tableName = process.env.TABLE_NAME
const baseUrl = process.env.BASE_URL
const s3 = new S3()
const dynamo = new DynamoDB.DocumentClient({ region: "eu-central-1" })
const ses = new SES()
const transporter = createTransport({
  SES: new SES({ region: "eu-central-1" }),
})

const forwardEmailHandler: Handler = async ({ Records }) => {
  const {
    source,
    commonHeaders: { from },
    destination,
    messageId,
  }: {
    source: string
    commonHeaders: { from: string[] }
    destination: string
    messageId: string
  } = Records[0].ses.mail

  try {
    const stream = s3
      .getObject({ Bucket: bucketName, Key: messageId })
      .createReadStream()

    const [
      { Item },
      { subject, text, html, attachments, inReplyTo },
    ] = await Promise.all([
      dynamo
        .get({
          TableName: tableName,
          Key: {
            PK: "FORWARD_EMAIL#" + destination,
            SK: "FORWARD_EMAIL#" + destination,
          },
          ProjectionExpression: "emails",
        })
        .promise(),
      simpleParser(stream),
    ])

    if (!Item?.emails.length) {
      throw new Error("No forward configured for this recipient.")
    }

    await Promise.all(
      Item?.emails.map((email: string) =>
        transporter.sendMail({
          from: `${from[0].split("<")[0]}<${createHash("sha256")
            .update(source)
            .digest("base64")}@${baseUrl}>`,
          to: email,
          subject,
          text,
          html: html || undefined,
          // @ts-ignore
          attachments: attachments,
          replyTo: from[0],
          inReplyTo,
        }),
      ),
    )

    await s3.deleteObject({ Bucket: bucketName, Key: messageId }).promise()
  } catch (err) {
    console.error(err)
    await ses
      .sendBounce({
        BounceSender: destination[0],
        BouncedRecipientInfoList: [{ Recipient: source }],
        OriginalMessageId: messageId,
      })
      .promise()
  }
}

exports.handler = forwardEmailHandler
