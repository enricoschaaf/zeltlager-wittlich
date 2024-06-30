import { randomBytes } from "node:crypto"

export function id() {
  return randomBytes(20).toString("base64url")
}
