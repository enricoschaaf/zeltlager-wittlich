import * as apiGateway from "@aws-cdk/aws-apigatewayv2"
import * as lambda from "@aws-cdk/aws-lambda"
import * as s3 from "@aws-cdk/aws-s3"
import * as cdk from "@aws-cdk/core"

export class TentCampImageTransformStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const tentCampBucket = new s3.Bucket(this, "tentCampBucket")

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
      path: "/{image}",
      methods: [apiGateway.HttpMethod.GET],
      integration: new apiGateway.LambdaProxyIntegration({
        handler: imageTransformLambda,
      }),
    })
  }
}
