import { Handler } from "aws-lambda"
import { DynamoDB, SES } from "aws-sdk"
import { id } from "../utils/id"

const tableName = process.env.TABLE_NAME
const baseUrl = process.env.BASE_URL
const dynamo = new DynamoDB.DocumentClient()

const ses = new SES()

function createConfirmationToken(
  newEmail: string,
  confirm: string,
  userId: string,
) {
  return dynamo
    .put({
      TableName: tableName,
      Item: {
        PK: "CONFIRM#" + confirm,
        SK: "CREATED_AT#" + Date.now(),
        type: "CHANGE_EMAIL_TOKEN",
        expiresAt: Math.round(Date.now() / 1000) + 600,
        userId,
        newEmail,
      },
    })
    .promise()
}

function sendEmail(email: string, confirm: string) {
  return ses
    .sendEmail({
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: "https://" + baseUrl + "/email/bestaetigen/" + confirm,
          },
          Text: {
            Data: "https://" + baseUrl + "/email/bestaetigen/" + confirm,
          },
        },
        Subject: {
          Data: "Neue Email bestätigen",
        },
      },
      Source: `Zeltlager Wittlich <mail@${baseUrl}>`,
    })
    .promise()
}

const asyncChangeEmailHandler: Handler = async ({
  newEmail,
  userId,
}: {
  newEmail: string
  userId: string
}) => {
  try {
    const confirm = id()
    await Promise.all([
      createConfirmationToken(newEmail, confirm, userId),
      sendEmail(newEmail, confirm),
    ])
  } catch (err) {
    console.error(err)
  }
}

exports.handler = asyncChangeEmailHandler
