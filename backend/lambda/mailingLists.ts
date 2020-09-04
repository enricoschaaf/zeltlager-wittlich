import { Handler } from "aws-lambda"
import { DynamoDB, S3, SES } from "aws-sdk"
import { simpleParser } from "mailparser"
import { createTransport } from "nodemailer"

const tableName = process.env.TABLE_NAME
const bucketName = process.env.BUCKET_NAME
const baseUrl = process.env.BASE_URL
const year = process.env.YEAR
const dynamo = new DynamoDB.DocumentClient({ region: "eu-central-1" })
const ses = new SES()
const s3 = new S3()
const transporter = createTransport({
  SES: new SES(),
})

const mailingListHandler: Handler = async ({ Records }) => {
  const {
    source,
    destination,
    messageId,
  }: {
    source: string
    destination: string
    messageId: string
  } = Records[0].ses.mail

  try {
    console.log(source)
    const stream = s3
      .getObject({ Bucket: bucketName, Key: messageId })
      .createReadStream()

    const [{ Items }, { Item }, { text, html }] = await Promise.all([
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
    console.log(emails.find((email) => email === source))
    if (Items?.length && emails.find((email) => email === source)) {
      console.log("inside")
      await Promise.all(
        Items.map(({ email }) => {
          transporter.sendMail({
            from: `Zeltlager Wittlich <mail@${baseUrl}>`,
            to: email,
            text,
            html: html || undefined,
          })
        }),
      )
    }
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

exports.handler = mailingListHandler
