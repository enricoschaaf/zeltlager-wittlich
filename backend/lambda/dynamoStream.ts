import { AttributeValue, DynamoDBStreamHandler } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { GoogleSpreadsheet } from "google-spreadsheet"

const googleSheetId = process.env.GOOGLE_SHEET_ID
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL
const googlePrivatKey = process.env.GOOGLE_PRIVATE_KEY
const year = process.env.YEAR

const doc = new GoogleSpreadsheet(googleSheetId)

function output(value: AttributeValue) {
  return DynamoDB.Converter.output(value)
}

const dynamoStreamHandler: DynamoDBStreamHandler = async ({ Records }) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: googleClientEmail,
      private_key: googlePrivatKey,
    })
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle[`Anmeldungen ${year}`]

    const data: any[] = []
    Records.forEach(({ eventName, dynamodb }) => {
      switch (eventName) {
        case "INSERT":
          if (!dynamodb?.NewImage) throw Error()
          const newImage = dynamodb.NewImage
          if (
            !(
              dynamodb?.Keys?.SK &&
              output(dynamodb.Keys.SK).startsWith("REGISTRATION#")
            )
          ) {
            break
          }

          data.push({
            "Nr.": output(newImage.id),
            Vorname: output(newImage.firstName),
            Nachname: output(newImage.lastName),
            Geburtsdatum: new Date(
              output(newImage.birthDate),
            ).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
            "Straße und Hausnummer": output(newImage.streetAddress),
            Postleitzahl: output(newImage.postalCode),
            Stadt: output(newImage.city),
            Handy: output(newImage.mobile),
            Email: output(newImage.email),
            Essgewohnheiten:
              output(newImage.eatingHabits) === "vegetarian"
                ? "Vegetarisch"
                : output(newImage.eatingHabits) === "vegan"
                ? "Vegan"
                : "Keine",
            Lebensmittelunterträglichkeiten: output(newImage.foodIntolerances),
            Schwimmen: output(newImage.canSwim) ? "Ja" : "Nein",
            Aufsicht: output(newImage.supervision) ? "Ja" : "Nein",
            Krankheiten: output(newImage.diseases),
            Allergien: output(newImage.allergies),
            Medikamente: output(newImage.medication),
            Krankenkasse: output(newImage.healthInsurance),
            "Name des Hausarztes": output(newImage.familyDoctorName),
            "Telefonnummer des Hausarztes": output(newImage.familyDoctorPhone),
          })
          break
      }
    })
    await sheet.addRows(data)
  } catch (err) {
    console.error(err)
  }
}

exports.handler = dynamoStreamHandler
