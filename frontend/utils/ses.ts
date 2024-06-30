import { SESClient } from "@aws-sdk/client-ses"
import { credentials } from "./credentials"

export const ses = new SESClient(credentials)
