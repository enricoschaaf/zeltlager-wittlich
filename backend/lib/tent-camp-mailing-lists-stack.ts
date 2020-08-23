import * as dynamo from "@aws-cdk/aws-dynamodb"
import * as lambda from "@aws-cdk/aws-lambda-nodejs"
import * as ses from "@aws-cdk/aws-ses"
import * as actions from "@aws-cdk/aws-ses-actions"
import * as cdk from "@aws-cdk/core"

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

    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable missing.")
    }

    const mailingListsLambda = new lambda.NodejsFunction(
      this,
      "mailingListsLambda",
      {
        entry: "lambda/mailingListsLambda.ts",
        environment: {
          tableName: props.table.tableName,
        },
      },
    )
    props.table.grant(mailingListsLambda, "dynamodb:Query")

    const forwardEmailLambda = new lambda.NodejsFunction(
      this,
      "forwardEmailLambda",
      {
        entry: "lambda/forwardEmailLambda.ts",
        environment: {
          tableName: props.table.tableName,
        },
      },
    )

    props.table.grant(mailingListsLambda, "dynamodb:GetItem")

    new ses.ReceiptRuleSet(this, "receiptRuleSet", {
      rules: [
        {
          recipients: [`{local}@${process.env.BASE_URL}`],
          actions: [new actions.Lambda({ function: forwardEmailLambda })],
        },
        {
          recipients: [`teilnehmende@${process.env.BASE_URL}`],
          actions: [new actions.Lambda({ function: mailingListsLambda })],
        },
      ],
    })
  }
}
