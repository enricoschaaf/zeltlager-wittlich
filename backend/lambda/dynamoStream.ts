import { AttributeValue, DynamoDBStreamHandler } from "aws-lambda"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { DynamoDB } from "aws-sdk"
import { JWT } from "google-auth-library"

const googleSheetId = process.env.GOOGLE_SHEET_ID
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL
const googlePrivatKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n")
const year = process.env.YEAR

const serviceAccountAuth = new JWT({
  email: googleClientEmail,
  key: googlePrivatKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const doc = new GoogleSpreadsheet(googleSheetId, serviceAccountAuth)

function output(value: AttributeValue) {
  return DynamoDB.Converter.output(value)
}

const gender = {
  M: "männlich",
  W: "weiblich",
  D: "divers",
} as const

const dynamoStreamHandler: DynamoDBStreamHandler = async ({ Records }) => {
  try {
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle[`Anmeldungen ${year}`]

    const data: any[] = []
    Records.forEach(async ({ eventName, dynamodb }, i) => {
      const newImage = dynamodb?.NewImage

      if (
        !(
          dynamodb?.Keys?.SK &&
          output(dynamodb.Keys.SK).startsWith("REGISTRATION#")
        )
      ) {
        return
      }

      if (!newImage) throw Error()

      const firstName = output(newImage.firstName)
      const lastName = output(newImage.lastName)

      switch (eventName) {
        case "INSERT":
          data.push({
            Vorname: firstName,
            Nachname: lastName,
            Geburtsdatum: new Date(
              output(newImage.birthDate),
            ).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
            Geschlecht: gender[output(newImage.gender) as "M" | "W" | "D"],
            "Straße und Hausnummer": output(newImage.streetAddress),
            Postleitzahl: output(newImage.postalCode),
            Stadt: output(newImage.city),
            Telefon: output(newImage.phoneNumbers).join(", "),
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
            "1. Hilfe": output(newImage.firstAid) ? "Ja" : "Nein",
            Krankheiten: output(newImage.diseases),
            Allergien: output(newImage.allergies),
            Medikamente: output(newImage.medications).join(", "),
            Krankenkasse: output(newImage.healthInsurance),
            "Name des Hausarztes": output(newImage.familyDoctorName),
            "Telefonnummer des Hausarztes": output(newImage.familyDoctorPhone),
            "In eine Gruppe mit": output(newImage.groupWith),
            "KjG - Mitglied": output(newImage.kjgMember) ? "Ja" : "Nein",
          })
          break
        case "MODIFY": {
          const rows = await sheet.getRows()

          const row = rows.find(
            (row) =>
              row.get("Vorname") === firstName &&
              row.get("Nachname") === lastName,
          )

          row?.assign({
            Geburtsdatum: new Date(
              output(newImage.birthDate),
            ).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
            Geschlecht: gender[output(newImage.gender) as "M" | "W" | "D"],
            "Straße und Hausnummer": output(newImage.streetAddress),
            Postleitzahl: output(newImage.postalCode),
            Stadt: output(newImage.city),
            Telefon: output(newImage.phoneNumbers).join(", "),
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
            "1. Hilfe": output(newImage.firstAid) ? "Ja" : "Nein",
            Krankheiten: output(newImage.diseases),
            Allergien: output(newImage.allergies),
            Medikamente: output(newImage.medications).join(", "),
            Krankenkasse: output(newImage.healthInsurance),
            "Name des Hausarztes": output(newImage.familyDoctorName),
            "Telefonnummer des Hausarztes": output(newImage.familyDoctorPhone),
            "In eine Gruppe mit": output(newImage.groupWith),
            "KjG - Mitglied": output(newImage.kjgMember) ? "Ja" : "Nein",
          })

          await row?.save()
        }
      }
    })
    await sheet.addRows(data)
  } catch (err) {
    console.error(err)
  }
}

exports.handler = dynamoStreamHandler
