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

interface TentCampStackProps extends cdk.StackProps {
  authTable: dynamo.Table
}

export class TentCampStack extends cdk.Stack {
  public table: dynamo.Table
  constructor(scope: cdk.Construct, id: string, props: TentCampStackProps) {
    super(scope, id, props)

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
    if (!process.env.MAX_PARTICIPANTS) {
      throw new Error("MAX_PARTICIPANTS environment variable missing.")
    }

    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable missing.")
    }

    const registerLambda = new lambda.NodejsFunction(this, "registerLambda", {
      entry: "lambda/register.ts",
      memorySize: 1024,
      environment: {
        TABLE_NAME: tentCampTable.tableName,
        AUTH_TABLE_NAME: props.authTable.tableName,
        YEAR: process.env.YEAR,
        MAX_PARTICIPANTS: process.env.MAX_PARTICIPANTS,
        BASE_URL: process.env.BASE_URL,
      },
    })
    registerLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["ses:SendTemplatedEmail"],
      }),
    )
    tentCampTable.grant(
      registerLambda,
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
    )
    props.authTable.grant(
      registerLambda,
      "dynamodb:Query",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
    )

    const tentCampApi = new apiGateway.HttpApi(this, "tentCampApi")

    tentCampApi.addRoutes({
      path: "/register",
      methods: [apiGateway.HttpMethod.POST],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: registerLambda,
      }),
    })
  }
}
