import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { credentials } from "./credentials"

export const dynamo = DynamoDBDocument.from(new DynamoDBClient(credentials))
