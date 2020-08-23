import { Handler } from "aws-lambda"

const forwardEmailHandler: Handler = async (event) => {
  console.log(event)
}

exports.handler = forwardEmailHandler
