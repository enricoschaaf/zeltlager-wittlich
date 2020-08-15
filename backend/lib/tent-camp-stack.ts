import * as apiGateway from "@aws-cdk/aws-apigatewayv2"
import * as dynamo from "@aws-cdk/aws-dynamodb"
import * as iam from "@aws-cdk/aws-iam"
import * as lambda from "@aws-cdk/aws-lambda"
import * as nodejs from "@aws-cdk/aws-lambda-nodejs"
import * as s3 from "@aws-cdk/aws-s3"
import * as cdk from "@aws-cdk/core"

export class TentCampStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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

    const tentCampBucket = new s3.Bucket(this, "tentCampBucket")

    const imageTransformLambda = new lambda.Function(
      this,
      "imageTransformLambda",
      {
        code: lambda.Code.fromAsset("lambda/imageTransform"),
        handler: "index.handler",
        runtime: lambda.Runtime.NODEJS_12_X,
        memorySize: 3008,
        environment: {
          BUCKET_NAME: tentCampBucket.bucketName,
        },
      },
    )
    tentCampBucket.grantRead(imageTransformLambda)

    const registerLambda = new nodejs.NodejsFunction(this, "registerLambda", {
      entry: "lambda/register.ts",
      memorySize: 3008,
      environment: {
        TABLE_NAME: tentCampTable.tableName,
        YEAR: "2021",
        MAX_PARTICIPANTS: "64",
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

    const tentCampApi = new apiGateway.HttpApi(this, "tentCampApi")

    tentCampApi.addRoutes({
      path: "/register",
      methods: [apiGateway.HttpMethod.POST],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: registerLambda,
      }),
    })

    tentCampApi.addRoutes({
      path: "/{image}",
      methods: [apiGateway.HttpMethod.GET],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: imageTransformLambda,
      }),
    })
  }
}
