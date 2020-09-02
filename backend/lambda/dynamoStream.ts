import { DynamoDBStreamHandler } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { GoogleSpreadsheet } from "google-spreadsheet"

const googleSheetId = process.env.GOOGLE_SHEET_ID
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL
const googlePrivatKey = process.env.GOOGLE_PRIVATE_KEY
const year = process.env.YEAR

const doc = new GoogleSpreadsheet(googleSheetId)

const dynamoStreamHandler: DynamoDBStreamHandler = async ({ Records }) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: googleClientEmail,
      private_key: googlePrivatKey,
    })
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle[`Anmeldungen ${year}`]

    let data: any
    Records.forEach(({ eventName, dynamodb }) => {
      switch (eventName) {
        case "INSERT":
          if (!dynamodb?.NewImage) throw Error()
          if (
            !(
              dynamodb?.Keys?.SK.S &&
              dynamodb.Keys.SK.S.startsWith("REGISTRATION#")
            )
          ) {
            break
          }
          data = Object.entries(dynamodb.NewImage).map(([, value]) =>
            DynamoDB.Converter.output(value),
          )
          break
      }
    })
    console.log(data)
    await sheet.addRows(data)
  } catch (err) {
    console.error(err)
  }
}

exports.handler = dynamoStreamHandler
