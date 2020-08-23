import { Handler } from "aws-lambda"

const mailingListsHandler: Handler = async (event) => {
  console.log(event)
}

exports.handler = mailingListsHandler
