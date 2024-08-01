"use server"

import { dynamo } from "utils/dynamo"
import { authTableName } from "utils/env"

export async function confirmSignIn({
  confirm,
}: {
  confirm: string
}): Promise<{ status: "success" } | { status: "error" }> {
  try {
    const { Items } = await dynamo.query({
      TableName: authTableName,
      IndexName: "GSI2",
      ProjectionExpression: "PK, SK",
      KeyConditionExpression: "GSI2PK = :pk AND GSI2SK > :sk",
      ExpressionAttributeValues: {
        ":pk": "CONFIRM#" + confirm,
        ":sk": "CREATED_AT#" + (Date.now() - 600000),
      },
    })

    if (!(Items && Items[0].PK && Items[0].SK)) return { status: "error" }

    const { PK, SK } = Items[0]

    await dynamo.update({
      TableName: authTableName,
      Key: { PK, SK },
      UpdateExpression: "SET confirmed = :true REMOVE expiresAt",
      ExpressionAttributeValues: { ":true": true },
    })

    return { status: "success" }
  } catch (err) {
    console.error(err)
    return { status: "error" }
  }
}
