"use client";
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useMutation } from "react-query"

async function confirmSignIn({ confirm }: { confirm: string }) {
  const { data } = await axios.post("/api/auth/confirm", { confirm })
  return data
}

export function useConfirmSignIn() {
  const {
  } = useRouter()

  const { mutate, status } = useMutation(confirmSignIn)

  const params = useSearchParams()
  const confirm = params.get("confirm")

  useEffect(() => {
    if (typeof confirm === "string") {
      mutate({ confirm })
    }
  }, [confirm, mutate])

  return { status }
}
