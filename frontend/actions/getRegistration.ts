"use server"

import { verify } from "jsonwebtoken"
import { authTableName, privateKey, tableName } from "utils/env"
import { dynamo } from "utils/dynamo"
import { config } from "project.config"

export async function getRegistration(
  accessToken: string,
  registrationId: string,
) {
  try {
    const { userId }: any = verify(accessToken, privateKey, {
      algorithms: ["RS256"],
    })

    const { Item } = await dynamo.get({
      TableName: authTableName,
      ProjectionExpression: "email",
      Key: { PK: "USER#" + userId, SK: "PROFILE" },
    })

    if (!Item?.email) return { error: "NOT_FOUND" }

    const { Item: registration } = await dynamo.get({
      TableName: tableName,
      Key: {
        PK: `REGISTRATIONS#${config.year}`,
        SK: `REGISTRATION#${registrationId}`,
      },
    })

    if (!registration) return { error: "NOT_FOUND" }

    if (registration.email.toLowerCase() !== Item.email.toLowerCase()) {
      return { error: "PERMISSION_ERROR" }
    }

    return {
      data: registration,
    }
  } catch (err) {
    console.error(err)
    return { error: "INTERNAL_ERROR" }
  }
}
