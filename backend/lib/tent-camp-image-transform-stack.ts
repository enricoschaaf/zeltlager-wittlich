import * as apiGateway from "@aws-cdk/aws-apigatewayv2"
import * as dynamo from "@aws-cdk/aws-dynamodb"
import * as iam from "@aws-cdk/aws-iam"
import * as lambda from "@aws-cdk/aws-lambda"
import * as eventSource from "@aws-cdk/aws-lambda-event-sources"
import * as nodejs from "@aws-cdk/aws-lambda-nodejs"
import * as s3 from "@aws-cdk/aws-s3"
import * as cdk from "@aws-cdk/core"
import { config } from "dotenv"

config()

export class TentCampImageTransformStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const tentCampImageTransformTable = new dynamo.Table(
      this,
      "tentCampImageTransformTable",
      {
        partitionKey: {
          name: "PK",
          type: dynamo.AttributeType.STRING,
        },
        sortKey: {
          name: "SK",
          type: dynamo.AttributeType.STRING,
        },
        billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      },
    )

    tentCampImageTransformTable.addGlobalSecondaryIndex({
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

    const tentCampBucket = new s3.Bucket(this, "tentCampBucket")

    if (!process.env.COMPUTER_VISION_KEY) {
      throw new Error("COMPUTER_VISION_KEY environment variable missing.")
    }

    if (!process.env.COMPUTER_VISION_ENDPOINT) {
      throw new Error("COMPUTER_VISION_ENDPOINT environment variable missing.")
    }

    const objectCreatedLambda = new lambda.Function(
      this,
      "objectCreatedLambda",
      {
        code: lambda.Code.fromAsset("lambda/objectCreated", {
          exclude: ["index.ts"],
        }),
        handler: "index.handler",
        runtime: lambda.Runtime.NODEJS_12_X,
        timeout: cdk.Duration.seconds(10),
        memorySize: 3008,
        environment: {
          TABLE_NAME: tentCampImageTransformTable.tableName,
          COMPUTER_VISION_KEY: process.env.COMPUTER_VISION_KEY,
          COMPUTER_VISION_ENDPOINT: process.env.COMPUTER_VISION_ENDPOINT,
        },
      },
    )
    tentCampImageTransformTable.grant(objectCreatedLambda, "dynamodb:PutItem")
    tentCampBucket.grantRead(objectCreatedLambda)
    objectCreatedLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["rekognition:IndexFaces", "translate:TranslateText"],
      }),
    )
    const objectCreateddEventSource = new eventSource.S3EventSource(
      tentCampBucket,
      {
        events: [s3.EventType.OBJECT_CREATED],
      },
    )
    objectCreateddEventSource.bind(objectCreatedLambda)

    const objectRemovedLambda = new nodejs.NodejsFunction(
      this,
      "objectRemovedLambda",
      {
        entry: "lambda/objectRemoved.ts",
        environment: {
          TABLE_NAME: tentCampImageTransformTable.tableName,
        },
      },
    )
    tentCampImageTransformTable.grant(
      objectRemovedLambda,
      "dynamodb:Query",
      "dynamodb:DeleteItem",
    )
    const objectRemovedEventSource = new eventSource.S3EventSource(
      tentCampBucket,
      {
        events: [s3.EventType.OBJECT_REMOVED],
      },
    )
    objectRemovedEventSource.bind(objectRemovedLambda)

    const imageTransformLambda = new lambda.Function(
      this,
      "imageTransformLambda",
      {
        code: lambda.Code.fromAsset("lambda/imageTransform", {
          exclude: ["index.ts"],
        }),
        handler: "index.handler",
        runtime: lambda.Runtime.NODEJS_12_X,
        timeout: cdk.Duration.seconds(10),
        memorySize: 3008,
        environment: {
          BUCKET_NAME: tentCampBucket.bucketName,
          TABLE_NAME: tentCampImageTransformTable.tableName,
        },
      },
    )
    tentCampBucket.grantRead(imageTransformLambda)
    tentCampImageTransformTable.grant(imageTransformLambda, "dynamodb:GetItem")

    const tentCampImageTransformApi = new apiGateway.HttpApi(
      this,
      "tentCampImageTransformApi",
    )

    tentCampImageTransformApi.addRoutes({
      path: "/{id+}",
      methods: [apiGateway.HttpMethod.GET],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: imageTransformLambda,
      }),
    })
  }
}
