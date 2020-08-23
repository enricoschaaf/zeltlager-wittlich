import * as apiGateway from "@aws-cdk/aws-apigatewayv2"
import * as dynamo from "@aws-cdk/aws-dynamodb"
import * as iam from "@aws-cdk/aws-iam"
import * as lambda from "@aws-cdk/aws-lambda-nodejs"
import * as cdk from "@aws-cdk/core"

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
    })

    this.table = tentCampTable
    if (!process.env.MAX_PARTICIPANTS) {
      throw new Error("MAX_PARTICIPANTS environment variable missing.")
    }

    if (!process.env.YEAR) {
      throw new Error("YEAR environment variable missing.")
    }

    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable missing.")
    }

    const registerLambda = new lambda.NodejsFunction(this, "registerLambda", {
      entry: "lambda/register.ts",
      memorySize: 3008,
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
        actions: ["ses:SendEmail"],
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
