import { Handler } from "aws-lambda"
import { DynamoDB, S3, SES } from "aws-sdk"
import { simpleParser } from "mailparser"
import { createTransport } from "nodemailer"

const tableName = process.env.TABLE_NAME
const bucketName = process.env.BUCKET_NAME
const baseUrl = process.env.BASE_URL
const s3 = new S3()
const year = process.env.YEAR
const dynamo = new DynamoDB.DocumentClient({ region: "eu-central-1" })
const ses = new SES()
const transporter = createTransport({
  SES: ses,
})

const mailingListHandler: Handler = async ({ Records }) => {
  const {
    source,
    messageId,
  }: {
    source: string
    destination: string[]
    messageId: string
  } = Records[0].ses.mail

  try {
    const stream = s3
      .getObject({ Bucket: bucketName, Key: messageId })
      .createReadStream()

    const [
      { Items },
      { Item },
      { from, subject, text, html, attachments },
    ] = await Promise.all([
      dynamo
        .query({
          TableName: tableName,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
          ExpressionAttributeValues: {
            ":pk": `REGISTRATIONS#${year}`,
            ":sk": "REGISTRATION#",
          },
          ProjectionExpression: "email",
        })
        .promise(),
      await dynamo
        .get({
          TableName: tableName,
          Key: {
            PK: "MAILING_LIST#teilnehmende@zeltlager-wittlich.de",
            SK: "MAILING_LIST#teilnehmende@zeltlager-wittlich.de",
          },
          ProjectionExpression: "emails",
        })
        .promise(),
      simpleParser(stream),
    ])
    const emails: string[] = Item?.emails
    if (
      Items?.length &&
      emails.find((email) => from?.value[0].address === email)
    ) {
      await Promise.all(
        [...new Set(Items.map(({ email }) => email))].map((email) => {
          transporter.sendMail({
            from: `Zeltlager Wittlich <mail@${baseUrl}>`,
            to: email,
            subject,
            text,
            html: html || undefined,
            // @ts-ignore
            attachments,
          })
        }),
      )
    }
    await s3.deleteObject({ Bucket: bucketName, Key: messageId }).promise()
  } catch (err) {
    console.error(err)
    await ses
      .sendBounce({
        BounceSender: `Mail Delivery Subsystem <mailer-daemon@${baseUrl}>`,
        BouncedRecipientInfoList: [
          {
            Recipient: source,
            BounceType: "Undefined",
          },
        ],
        OriginalMessageId: messageId,
      })
      .promise()
  }
}

exports.handler = mailingListHandler
