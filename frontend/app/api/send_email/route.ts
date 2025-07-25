import { SendEmailCommand } from "@aws-sdk/client-ses"
import { config } from "project.config"
import { ses } from "utils/ses"
import { successfulRegistration } from "../register/route"

export async function GET() {
  let email = successfulRegistration({
    firstName: "Henri",
    lastName: "Voss",
  })

  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: ["jackie1.voss@gmail.com"],
        BccAddresses: [`mail@${config.domain}`],
      },
      Message: {
        Subject: { Data: email.subject },
        Body: { Text: { Data: email.body } },
      },
      Source: `${config.shortName} Wittlich <mail@${config.domain}>`,
    }),
  )

  email = successfulRegistration({
    firstName: "Emily",
    lastName: "Klocke",
  })

  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: ["mirjam.klocke@gmail.com"],
        BccAddresses: [`mail@${config.domain}`],
      },
      Message: {
        Subject: { Data: email.subject },
        Body: { Text: { Data: email.body } },
      },
      Source: `${config.shortName} Wittlich <mail@${config.domain}>`,
    }),
  )

  return new Response("Email send", { status: 200 })
}
