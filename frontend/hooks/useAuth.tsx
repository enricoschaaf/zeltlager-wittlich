import { access } from "actions/access"
import decode from "jwt-decode"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { accessToken, setAccessToken } from "utils/accessToken"

export function useAuth() {
  const { push } = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [accessTokenState, setAccessTokenState] = useState<string>()

  const redirect = params.get("redirect")

  useEffect(() => {
    try {
      const { exp } = decode(accessToken)

      if (Date.now() / 1000 > exp) throw Error
      setAccessTokenState(accessToken)
    } catch {
      access().then(({ error, data }) => {
        if (data?.accessToken) {
          setAccessToken(data.accessToken)
          setAccessTokenState(data.accessToken)

          if (pathname === "/login") {
            push(typeof redirect === "string" ? redirect : "/anmeldungen")
          }
        } else {
          if (pathname !== "/login") {
            push("/login?redirect=" + pathname)
          }
        }
      })
    }
  })

  return accessTokenState
}
