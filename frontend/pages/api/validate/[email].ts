import EmailValidator from "email-deep-validator"
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email
  if (typeof email === "string") {
    const emailValidator = new EmailValidator()
    const { validMailbox } = await emailValidator.verify(email)
    res.json({ valid: validMailbox })
  }
}
