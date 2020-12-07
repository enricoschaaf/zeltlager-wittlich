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
  SES: new SES({ region: "eu-west-1" }),
})

const forwardEmailHandler: Handler = async ({ Records }) => {
  const {
    mail: {
      source,
      commonHeaders: { from },
      messageId,
    },
    receipt: { recipients },
  }: {
    mail: {
      source: string
      commonHeaders: { from: string[] }
      messageId: string
    }
    receipt: { recipients: string[] }
  } = Records[0].ses

  try {
    const stream = s3
      .getObject({ Bucket: bucketName, Key: messageId })
      .createReadStream()

    const [
      { Responses },
      { subject, text, html, attachments, inReplyTo },
    ] = await Promise.all([
      dynamo
        .batchGet({
          RequestItems: {
            [tableName]: {
              Keys: recipients.map((recipient) => ({
                PK: `FORWARD_EMAIL#${recipient}`,
                SK: `FORWARD_EMAIL#${recipient}`,
              })),
            },
          },
        })
        .promise(),
      simpleParser(stream),
    ])

    if (!Responses?.[tableName]) {
      throw new Error("No forward configured for this recipient.")
    }

    await Promise.all(
      Responses[tableName]
        .flatMap(({ emails }) => emails)
        .map((email: string) =>
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
        BounceSender: `Mail Delivery Subsystem <mailer-daemon@${
          recipients[0].split("@")[1]
        }>`,
        BouncedRecipientInfoList: [
          ...recipients.map((recipient) => ({
            Recipient: recipient,
            BounceType: "Undefined",
          })),
        ],
        OriginalMessageId: messageId,
      })
      .promise()
  }
}

exports.handler = forwardEmailHandler
