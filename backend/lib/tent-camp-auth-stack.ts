import * as apiGateway from "@aws-cdk/aws-apigatewayv2"
import * as dynamo from "@aws-cdk/aws-dynamodb"
import * as iam from "@aws-cdk/aws-iam"
import * as lambda from "@aws-cdk/aws-lambda-nodejs"
import * as cdk from "@aws-cdk/core"
import { config } from "dotenv"
import { readFileSync } from "fs"

config()

export class TentCampAuthStack extends cdk.Stack {
  public authTable: dynamo.Table
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const tentCampAuthTable = new dynamo.Table(this, "tentCampAuthTable", {
      partitionKey: {
        name: "PK",
        type: dynamo.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamo.AttributeType.STRING,
      },
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "expiresAt",
    })

    this.authTable = tentCampAuthTable

    tentCampAuthTable.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: {
        name: "GSI1PK",
        type: dynamo.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI1SK",
        type: dynamo.AttributeType.STRING,
      },
    })

    tentCampAuthTable.addGlobalSecondaryIndex({
      indexName: "GSI2",
      partitionKey: {
        name: "GSI2PK",
        type: dynamo.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI2SK",
        type: dynamo.AttributeType.STRING,
      },
    })

    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable missing.")
    }

    const signInLambda = new lambda.NodejsFunction(this, "signInLambda", {
      entry: "lambda/signIn.ts",
      environment: {
        TABLE_NAME: tentCampAuthTable.tableName,
        BASE_URL: process.env.BASE_URL,
      },
      memorySize: 1024,
    })
    tentCampAuthTable.grant(signInLambda, "dynamodb:Query", "dynamodb:PutItem")
    signInLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["ses:SendEmail"],
      }),
    )
    const signOutLambda = new lambda.NodejsFunction(this, "signOutLambda", {
      entry: "lambda/signOut.ts",
      environment: {
        TABLE_NAME: tentCampAuthTable.tableName,
      },
      memorySize: 1024,
    })
    tentCampAuthTable.grant(signOutLambda, "dynamodb:DeleteItem")

    const refreshLambda = new lambda.NodejsFunction(this, "refreshLambda", {
      entry: "lambda/refresh.ts",
      environment: {
        TABLE_NAME: tentCampAuthTable.tableName,
        PRIVAT_KEY: readFileSync("private.pem").toString(),
      },
      memorySize: 1024,
    })
    tentCampAuthTable.grant(refreshLambda, "dynamodb:Query")

    const confirmLambda = new lambda.NodejsFunction(this, "confirmLambda", {
      entry: "lambda/confirm.ts",
      environment: {
        TABLE_NAME: tentCampAuthTable.tableName,
      },
      memorySize: 1024,
    })
    tentCampAuthTable.grant(
      confirmLambda,
      "dynamodb:Query",
      "dynamodb:UpdateItem",
    )

    const accessLambda = new lambda.NodejsFunction(this, "accessLambda", {
      entry: "lambda/access.ts",
      environment: {
        TABLE_NAME: tentCampAuthTable.tableName,
        PRIVAT_KEY: readFileSync("private.pem").toString(),
      },
      memorySize: 1024,
    })
    tentCampAuthTable.grant(accessLambda, "dynamodb:GetItem")

    const profileLambda = new lambda.NodejsFunction(this, "profileLambda", {
      entry: "lambda/profile.ts",
      environment: {
        TABLE_NAME: tentCampAuthTable.tableName,
        PUBLIC_KEY: readFileSync("public.pem").toString(),
      },
      memorySize: 1024,
    })
    tentCampAuthTable.grant(profileLambda, "dynamodb:GetItem")

    const asyncChangeEmailLambda = new lambda.NodejsFunction(
      this,
      "asyncChangeEmailLambda",
      {
        entry: "lambda/asyncChangeEmail.ts",
        environment: {
          TABLE_NAME: tentCampAuthTable.tableName,
          BASE_URL: process.env.BASE_URL,
        },
        memorySize: 1024,
      },
    )
    tentCampAuthTable.grant(asyncChangeEmailLambda, "dynamodb:PutItem")
    asyncChangeEmailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["ses:SendEmail"],
      }),
    )

    const changeEmailLambda = new lambda.NodejsFunction(
      this,
      "changeEmailLambda",
      {
        entry: "lambda/changeEmail.ts",
        environment: {
          FUNCTION_NAME: asyncChangeEmailLambda.functionName,
          TABLE_NAME: tentCampAuthTable.tableName,
          PUBLIC_KEY: readFileSync("public.pem").toString(),
        },
        memorySize: 1024,
      },
    )
    asyncChangeEmailLambda.grantInvoke(changeEmailLambda)
    tentCampAuthTable.grant(changeEmailLambda, "dynamodb:Query")

    const confirmNewEmailLambda = new lambda.NodejsFunction(
      this,
      "confirmNewEmailLambda",
      {
        entry: "lambda/confirmNewEmail.ts",
        environment: {
          TABLE_NAME: tentCampAuthTable.tableName,
        },
        memorySize: 1024,
      },
    )
    tentCampAuthTable.grant(
      confirmNewEmailLambda,
      "dynamodb:Query",
      "dynamodb:UpdateItem",
    )

    const tentCampAuthApi = new apiGateway.HttpApi(this, "tentCampAuthApi")

    tentCampAuthApi.addRoutes({
      path: "/signin",
      methods: [apiGateway.HttpMethod.POST],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: signInLambda,
      }),
    })

    tentCampAuthApi.addRoutes({
      path: "/signout",
      methods: [apiGateway.HttpMethod.POST],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: signOutLambda,
      }),
    })

    tentCampAuthApi.addRoutes({
      path: "/refresh/{tokenId}",
      methods: [apiGateway.HttpMethod.GET],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: refreshLambda,
      }),
    })

    tentCampAuthApi.addRoutes({
      path: "/confirm",
      methods: [apiGateway.HttpMethod.POST],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: confirmLambda,
      }),
    })

    tentCampAuthApi.addRoutes({
      path: "/access",
      methods: [apiGateway.HttpMethod.GET],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: accessLambda,
      }),
    })

    tentCampAuthApi.addRoutes({
      path: "/profile",
      methods: [apiGateway.HttpMethod.GET],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: profileLambda,
      }),
    })

    tentCampAuthApi.addRoutes({
      path: "/email/change",
      methods: [apiGateway.HttpMethod.POST],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: changeEmailLambda,
      }),
    })

    tentCampAuthApi.addRoutes({
      path: "/email/confirm",
      methods: [apiGateway.HttpMethod.POST],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: confirmNewEmailLambda,
      }),
    })
  }
}
