"use server"

import { verify } from "jsonwebtoken"
import { authTableName, privateKey, tableName } from "utils/env"
import { dynamo } from "utils/dynamo"
import { config } from "project.config"

export async function getRegistrations(accessToken: string) {
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

    const { Items } = await dynamo.query({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": "REGISTRATIONS#" + config.year,
        ":sk": "REGISTRATION#",
      },
    })

    // .filter((r) => {
    //   return r.email.toLowerCase() === Item.email.toLowerCase()
    // })

    return {
      data:
        Items?.map((item) => ({
          id: item.registrationId,
          name: `${item.firstName} ${item.lastName}`,
          email: item.email,
        })) ?? [],
    }
  } catch (err) {
    console.error(err)
    return { error: "INTERNAL_ERROR" }
  }
}
