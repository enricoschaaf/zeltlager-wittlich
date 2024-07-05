"use server"

import { SendEmailCommand } from "@aws-sdk/client-ses"
import { config } from "project.config"
import { dynamo } from "utils/dynamo"
import { authTableName } from "utils/env"
import { id } from "utils/id"
import { ses } from "utils/ses"
import * as z from "zod"

const schema = z.object({
  email: z.string().email(),
})

async function getUserIdByEmail(email: string) {
  const { Items } = await dynamo.query({
    TableName: authTableName,
    IndexName: "GSI1",
    ProjectionExpression: "userId",
    KeyConditionExpression: "GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk",
    ExpressionAttributeValues: {
      ":gsi1pk": "EMAIL#" + email,
      ":gsi1sk": "PROFILE",
    },
  })

  if (Items && Items[0]?.userId) return Items[0].userId
}

export async function signIn(input: { email: string }) {
  const data = schema.parse(input)

  const [refreshToken, confirm, tokenId] = [id(), id(), id()]

  const userId = await getUserIdByEmail(data.email)

  if (!userId) throw new Error("User not found")

  await Promise.all([
    dynamo.put({
      TableName: authTableName,
      Item: {
        PK: "TOKEN#" + refreshToken,
        SK: "TOKEN#" + refreshToken,
        GSI1PK: "ID#" + tokenId,
        GSI1SK: "CREATED_AT#" + Date.now(),
        GSI2PK: "CONFIRM#" + confirm,
        GSI2SK: "CREATED_AT#" + Date.now(),
        type: "REFRESH_TOKEN",
        expiresAt: Math.round(Date.now() / 1000) + 600,
        refreshToken: refreshToken,
        userId,
        confirmed: false,
      },
    }),
    ses.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: [data.email],
        },
        Message: {
          Body: {
            Text: {
              Data: `Hallo,

Sie haben sich angemeldet, um die Informationen Ihres Kindes für das Zeltlager zu ändern.
Mit dem Klicken auf den folgenden Link bestätigen Sie die Anmeldung: https://${config.domain}/bestaetigen/${confirm}
Sie können die Änderungen anschließend in dem Browserfenster vornehmen, in dem Sie die Anmeldung begonnen haben.

Viele Grüße
Das Zeltlager der Pfarrei im Wittlicher Tal St. Anna`,
            },
          },
          Subject: {
            Data: "Anmeldung bestätigen",
          },
        },
        Source: `Zeltlager Wittlich <mail@${config.domain}>`,
      }),
    ),
  ])

  return { tokenId }
}
