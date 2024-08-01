"use server"

import { cookies } from "next/headers"
import { createAccessToken } from "utils/createAccessToken"
import { dynamo } from "utils/dynamo"
import { authTableName, privateKey } from "utils/env"

export async function refresh(tokenId: string) {
  try {
    const { Items } = await dynamo.query({
      TableName: authTableName,
      IndexName: "GSI1",
      ProjectionExpression: "refreshToken, confirmed, userId",
      KeyConditionExpression: "GSI1PK = :pk AND GSI1SK > :sk",
      ExpressionAttributeValues: {
        ":pk": "ID#" + tokenId,
        ":sk": "CREATED_AT#" + (Date.now() - 600000),
      },
    })

    if (
      !(
        Items?.length &&
        Items[0].refreshToken &&
        typeof Items[0].confirmed === "boolean" &&
        Items[0].userId
      )
    ) {
      return {
        error: "BAD_REQUEST",
      }
    }

    const { refreshToken, confirmed, userId } = Items[0]

    if (!confirmed) {
      return
    }

    cookies().set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 2147483647,
    })

    return {
      accessToken: createAccessToken(userId, privateKey),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: "INTERNAL_SERVER_ERROR",
    }
  }
}
