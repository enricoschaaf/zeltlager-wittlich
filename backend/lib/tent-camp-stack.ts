import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations"
import * as apiGateway from "@aws-cdk/aws-apigatewayv2"
import * as dynamo from "@aws-cdk/aws-dynamodb"
import { StreamViewType } from "@aws-cdk/aws-dynamodb"
import * as iam from "@aws-cdk/aws-iam"
import { StartingPosition } from "@aws-cdk/aws-lambda"
import * as eventSource from "@aws-cdk/aws-lambda-event-sources"
import * as lambda from "@aws-cdk/aws-lambda-nodejs"
import * as cdk from "@aws-cdk/core"
import { config } from "dotenv"
config()

export class TentCampStack extends cdk.Stack {
  public table: dynamo.Table
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const authTable = dynamo.Table.fromTableArn(
      this,
      "authTable",
      "arn:aws:dynamodb:eu-central-1:411166291189:table/TentCampAuthStack-tentCampAuthTable8D573192-VF1MK5TUA5AP",
    )
    const tentCampTable = new dynamo.Table(this, "tentCampTable", {
      partitionKey: {
        name: "PK",
        type: dynamo.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamo.AttributeType.STRING,
      },
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      tableName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    })

    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error("GOOGLE_CLIENT_EMAIL environment variable missing.")
    }

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("GOOGLE_PRIVATE_KEY environment variable missing.")
    }

    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error("GOOGLE_SHEET_ID environment variable missing.")
    }

    if (!process.env.YEAR) {
      throw new Error("YEAR environment variable missing.")
    }

    const dynamoStreamLambda = new lambda.NodejsFunction(
      this,
      "dynamoStreamLambda",
      {
        entry: "lambda/dynamoStream.ts",
        environment: {
          GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
          GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
          GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
          YEAR: process.env.YEAR,
        },
        timeout: cdk.Duration.seconds(10),
        memorySize: 1024,
      },
    )
    const dynamoEventSource = new eventSource.DynamoEventSource(tentCampTable, {
      startingPosition: StartingPosition.TRIM_HORIZON,
    })
    dynamoEventSource.bind(dynamoStreamLambda)

    this.table = tentCampTable
  }
}
