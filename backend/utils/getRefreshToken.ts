export function getRefreshToken(cookies?: string[]) {
  return cookies
    ?.find((cookie: string) => cookie.startsWith("refreshToken"))
    ?.split("=")[1]
}
