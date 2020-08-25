import * as dynamo from "@aws-cdk/aws-dynamodb"
import * as iam from "@aws-cdk/aws-iam"
import * as lambda from "@aws-cdk/aws-lambda-nodejs"
import * as s3 from "@aws-cdk/aws-s3"
import * as ses from "@aws-cdk/aws-ses"
import * as actions from "@aws-cdk/aws-ses-actions"
import * as cdk from "@aws-cdk/core"
import { config } from "dotenv"
config()

interface TentCampMailingListsStackProps extends cdk.StackProps {
  table: dynamo.Table
}

export class TentCampMailingListsStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: TentCampMailingListsStackProps,
  ) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, "bucket")

    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable missing.")
    }

    if (!process.env.YEAR) {
      throw new Error("YEAR environment variable missing.")
    }

    const mailingListsLambda = new lambda.NodejsFunction(
      this,
      "mailingListsLambda",
      {
        entry: "lambda/mailingLists.ts",
        environment: {
          TABLE_NAME: props.table.tableName,
          BUCKET_NAME: bucket.bucketName,
          BASE_URL: process.env.BASE_URL,
          YEAR: process.env.YEAR,
        },
      },
    )
    props.table.grant(mailingListsLambda, "dynamodb:Query")
    mailingListsLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["ses:SendBounce", "ses:SendRawEmail"],
      }),
    )
    mailingListsLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: [`${bucket.bucketArn}/*`],
        actions: ["s3:GetObject", "s3:DeleteObject"],
      }),
    )

    const forwardEmailLambda = new lambda.NodejsFunction(
      this,
      "forwardEmailLambda",
      {
        entry: "lambda/forwardEmail.ts",
        environment: {
          TABLE_NAME: props.table.tableName,
          BUCKET_NAME: bucket.bucketName,
          BASE_URL: process.env.BASE_URL,
        },
      },
    )
    props.table.grant(forwardEmailLambda, "dynamodb:GetItem")
    forwardEmailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["ses:SendBounce", "ses:SendRawEmail"],
      }),
    )
    forwardEmailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: [`${bucket.bucketArn}/*`],
        actions: ["s3:GetObject", "s3:DeleteObject"],
      }),
    )

    new ses.ReceiptRuleSet(this, "receiptRuleSet", {
      rules: [
        {
          recipients: [`teilnehmende@${process.env.BASE_URL}`],
          actions: [new actions.Lambda({ function: mailingListsLambda })],
        },
        {
          actions: [new actions.S3({ bucket })],
          recipients: [process.env.BASE_URL, `.${process.env.BASE_URL}`],
        },
        {
          actions: [new actions.Lambda({ function: forwardEmailLambda })],
          recipients: [process.env.BASE_URL, `.${process.env.BASE_URL}`],
        },
      ],
    })
  }
}
