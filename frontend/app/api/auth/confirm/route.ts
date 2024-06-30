import { dynamo } from "utils/dynamo"

const tableName = process.env.TABLE_NAME

export async function POST(request: Request) {
  try {
    const { confirm } = await request.json()

    if (typeof confirm !== "string")
      return new Response(undefined, { status: 400 })

    const { Items } = await dynamo.query({
      TableName: tableName,
      IndexName: "GSI2",
      ProjectionExpression: "PK, SK",
      KeyConditionExpression: "GSI2PK = :pk AND GSI2SK > :sk",
      ExpressionAttributeValues: {
        ":pk": "CONFIRM#" + confirm,
        ":sk": "CREATED_AT#" + (Date.now() - 600000),
      },
    })

    if (!(Items && Items[0].PK && Items[0].SK))
      return new Response(undefined, { status: 400 })

    const { PK, SK } = Items[0]

    await dynamo.update({
      TableName: tableName,
      Key: { PK, SK },
      UpdateExpression: "SET confirmed = :true REMOVE expiresAt",
      ExpressionAttributeValues: { ":true": true },
    })

    return new Response()
  } catch (err) {
    console.error(err)
    return new Response(undefined, { status: 500 })
  }
}
