import { DynamoDBStreamHandler } from "aws-lambda"
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
    const data = Records.filter(
      ({ eventName, dynamodb }) =>
        dynamodb?.Keys?.SK.S &&
        dynamodb.Keys.SK.S.startsWith("REGISTRATION#") &&
        eventName === "INSERT",
    ).map(({ dynamodb }) => {
      const data = dynamodb?.NewImage
      if (data) {
        return {
          "Nr.": data?.id?.N ?? "",
          Vorname: data?.firstName?.S ?? "",
          Nachname: data?.lastName?.S ?? "",
          Geburtsdatum: data?.birthDate?.S
            ? new Date(data?.birthDate?.S).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "",
          "Straße und Hausnummer": data?.streetAddress?.S ?? "",
          Postleitzahl: data?.postalCode?.S ?? "",
          Stadt: data?.city?.S ?? "",
          Handy: data?.mobile?.S ?? "",
          Email: data?.email?.S ?? "",
          Essgewohnheiten:
            data?.eatingHabits?.S === "vegetarian"
              ? "Vegetarisch"
              : data?.eatingHabits?.S === "vegan"
              ? "Vegan"
              : "Keine",
          Lebensmittelunterträglichkeiten: data?.foodIntolerances?.S ?? "",
          Schwimmen: data?.canSwim?.BOOL === true ? "Ja" : "Nein",
          Aufsicht: data?.supervision?.BOOL === true ? "Ja" : "Nein",
          Krankheiten: data?.diseases?.S ?? "",
          Allergien: data?.allergies?.S ?? "",
          Medikamente: data?.medication?.S ?? "",
          "Name des Hausarztes": data?.familyDoctorName?.S ?? "",
          "Telefonnummer des Hausarztes": data?.familyDoctorPhone?.S ?? "",
          Krankenkasse: data?.healthInsurance?.S ?? "",
        }
      } else {
        return {
          "Nr.": "",
          Vorname: "",
          Nachname: "",
          Geburtsdatum: "",
          "Straße und Hausnummer": "",
          Postleitzahl: "",
          Stadt: "",
          Handy: "",
          Email: "",
          Essgewohnheiten: "",
          Lebensmittelunterträglichkeiten: "",
          Schwimmen: "",
          Aufsicht: "",
          Krankheiten: "",
          Allergien: "",
          Medikamente: "",
          "Name des Hausarztes": "",
          "Telefonnummer des Hausarztes": "",
          Krankenkasse: "",
        }
      }
    })

    if (data.length > 0) {
      await sheet.addRows(data)
    }
  } catch (err) {
    console.error(err)
  }
}

exports.handler = dynamoStreamHandler
