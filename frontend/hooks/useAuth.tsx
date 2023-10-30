import axios from "axios"
import decode from "jwt-decode"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { accessToken, setAccessToken } from "utils/accessToken"

export function useAuth() {
  const { push } = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const redirect = params.get("redirect")

  useEffect(() => {
    try {
      const { exp } = decode(accessToken)
      if (Date.now() / 1000 > exp) throw Error
    } catch {
      axios
        .get("/api/auth/access")
        .then(({ data }) => {
          setAccessToken(data.accessToken)
          if (pathname === "/login") {
            push(typeof redirect === "string" ? redirect : "/anmeldungen")
          }
        })
        .catch(() => {
          if (pathname !== "/login") {
            push("/login?redirect=" + pathname)
          }
        })
    }
  }, [pathname])
}
