"use server"

import { createAccessToken } from "utils/createAccessToken"
import { dynamo } from "utils/dynamo"
import { authTableName, privateKey } from "utils/env"
import { cookies } from "next/headers"

const unauthorized = { error: "UNAUTHORIZED", data: undefined }

export async function access() {
  try {
    const refreshToken = cookies().get("refreshToken")?.value

    if (!refreshToken) return unauthorized

    const { Item } = await dynamo.get({
      TableName: authTableName,
      Key: { PK: "TOKEN#" + refreshToken, SK: "TOKEN#" + refreshToken },
      ProjectionExpression: "userId",
    })

    const userId = Item?.userId

    if (!userId) return unauthorized

    console.log({
      data: { accessToken: createAccessToken(userId, privateKey) },
      error: undefined,
    })
    return {
      data: { accessToken: createAccessToken(userId, privateKey) },
      error: undefined,
    }
  } catch (err) {
    console.error(err)
    return {
      error: "INTERNAL_SERVER_ERROR",
      data: undefined,
    }
  }
}
