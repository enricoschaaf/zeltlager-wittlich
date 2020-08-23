export function getAccessToken(headers: { [name: string]: string }) {
  const { authorization } = headers
  if (!authorization) return { statusCode: 401 }
  const accessToken = authorization.split(" ")[1]
  return { accessToken }
}
