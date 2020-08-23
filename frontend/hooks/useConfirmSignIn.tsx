import axios from "axios"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMutation } from "react-query"

async function confirmSignIn({ confirm }: { confirm: string }) {
  const { data } = await axios.post("/api/auth/confirm", { confirm })
  return data
}

export function useConfirmSignIn() {
  const {
    query: { confirm },
  } = useRouter()

  const [mutation, { status }] = useMutation(confirmSignIn)

  useEffect(() => {
    if (typeof confirm === "string") {
      mutation({ confirm })
    }
  }, [confirm, mutation])

  return { status }
}
