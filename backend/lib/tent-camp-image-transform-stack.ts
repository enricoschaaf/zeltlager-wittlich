import * as apiGateway from "@aws-cdk/aws-apigatewayv2"
import * as dynamo from "@aws-cdk/aws-dynamodb"
import * as iam from "@aws-cdk/aws-iam"
import * as lambda from "@aws-cdk/aws-lambda"
import * as eventSource from "@aws-cdk/aws-lambda-event-sources"
import * as nodejs from "@aws-cdk/aws-lambda-nodejs"
import * as s3 from "@aws-cdk/aws-s3"
import * as cdk from "@aws-cdk/core"

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

    const tentCampBucketEventSourceLambda = new nodejs.NodejsFunction(
      this,
      "tentCampBucketEventSourceLambda",
      {
        entry: "lambda/tentCampBucketEventSource.ts",
        memorySize: 3008,
        environment: {
          TABLE_NAME: tentCampImageTransformTable.tableName,
        },
      },
    )
    tentCampBucket.grantRead(tentCampBucketEventSourceLambda)
    tentCampBucketEventSourceLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["rekognition:IndexFaces", "rekognition:DetectLabels"],
      }),
    )
    tentCampImageTransformTable.grant(
      tentCampBucketEventSourceLambda,
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    )

    const tentCampBucketEventSource = new eventSource.S3EventSource(
      tentCampBucket,
      {
        events: [s3.EventType.OBJECT_CREATED, s3.EventType.OBJECT_REMOVED],
      },
    )
    tentCampBucketEventSource.bind(tentCampBucketEventSourceLambda)

    const imageTransformLambda = new lambda.Function(
      this,
      "imageTransformLambda",
      {
        code: lambda.Code.fromAsset("lambda/imageTransform", {
          exclude: ["index.ts"],
        }),
        handler: "index.handler",
        runtime: lambda.Runtime.NODEJS_12_X,
        memorySize: 3008,
        environment: {
          BUCKET_NAME: tentCampBucket.bucketName,
        },
      },
    )
    tentCampBucket.grantRead(imageTransformLambda)

    const tentCampImageTransformApi = new apiGateway.HttpApi(
      this,
      "tentCampImageTransformApi",
    )

    tentCampImageTransformApi.addRoutes({
      path: "/{path+}",
      methods: [apiGateway.HttpMethod.GET],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: imageTransformLambda,
      }),
    })
  }
}
