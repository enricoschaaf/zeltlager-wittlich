import axios from "axios"
import decode from "jwt-decode"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { accessToken, setAccessToken } from "utils/accessToken"

export function useAuth() {
  const { push, pathname, query } = useRouter()

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
            push(
              typeof query.redirect === "string"
                ? query.redirect
                : "/anmeldungen",
            )
          }
        })
        .catch(() => {
          if (pathname !== "/login") {
            push("/login?redirect=" + pathname)
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
}
