"use client"
import axios from "axios"
import { AnimatePresence } from "framer-motion"
import { useAuth } from "hooks/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { Button, Input, Modal } from "tailwindcssUi"
import { setAccessToken } from "utils/accessToken"
import { emailRegex } from "utils/regex"

async function signInMutation(email: string) {
  const { data } = await axios.post("/api/auth/signin", {
    email,
  })
  return data
}

async function refreshQuery({ queryKey }: { queryKey: string }) {
  try {
    const { data } = await axios.get("/api/auth/refresh/" + queryKey)
    return data
  } catch (err) {
    if ((err as any).response.status) return { expired: true }
  }
}

export const LoginForm = () => {
  useAuth()
  const [modal, setModal] = useState<"closed" | "open">("closed")
  const [interval, setInterval] = useState<500 | undefined>(undefined)
  const { push } = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState<string>("")
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ email: string }>()
  const { data, isLoading, mutate } = useMutation(signInMutation, {
    onSuccess: () => {
      setInterval(500)
      setModal("open")
    },
    onError: (err: any) => {
      if (err?.response.status === 404) {
        setError("email", {
          type: "validate",
          message: "Wir konnten kein Konto mit dieser Email Adresse finden.",
        })
      }
    },
  })

  const redirect = params.get("redirect")

  const { data: refreshData } = useQuery(data?.tokenId, refreshQuery, {
    refetchInterval: interval,
    refetchOnWindowFocus: interval ? true : false,
    refetchOnReconnect: true,
    enabled: !!data,
    useErrorBoundary: true,
    onSuccess: ({ accessToken }) => {
      if (accessToken) {
        setAccessToken(data.accessToken)
        push(typeof redirect === "string" ? redirect : "/anmeldungen")
      }
    },
  })

  async function onSubmit({ email }: { email: string }) {
    setEmail(email)
    mutate(email)
  }

  useEffect(() => {
    if (refreshData?.expired) setInterval(undefined)
  }, [refreshData])

  return (
    <>
      <form
        className="grid w-full max-w-sm gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label={{ value: "Email", visibility: "hidden" }}
          inputMode="email"
          autoComplete="email"
          placeholder="Email Adresse"
          errors={errors}
          {...register("email", {
            required: "Bitte geben Sie Ihre Email Adresse an.",
            pattern: {
              value: emailRegex,
              message: "Ihre Email Adresse hat nicht das richtige Format.",
            },
          })}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <svg
              className="w-5 h-5 ml-3 -mr-1 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Anmelden"
          )}
        </Button>
      </form>
      <AnimatePresence>
        {modal === "open" ? (
          <Modal>
            {refreshData?.expired ? (
              <>
                <div>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-6 h-6 text-yellow-600"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-headline"
                    >
                      Magischer Link abgelaufen
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        Wir senden Ihnen einen neuen magischen Link an{" "}
                        <b className="text-primary-600">{email}</b>. Klicken Sie
                        diesen um sich anzumelden.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <span className="flex w-full rounded-md shadow-sm sm:col-start-2">
                    <button
                      type="button"
                      onClick={() => mutate(email)}
                      className="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary sm:text-sm sm:leading-5"
                    >
                      Erneut senden
                    </button>
                  </span>
                  <span className="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:col-start-1">
                    <button
                      type="button"
                      onClick={() => {
                        setInterval(undefined)
                        setModal("closed")
                      }}
                      className="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5"
                    >
                      Abbrechen
                    </button>
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 rounded-full">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-headline"
                    >
                      Bestätigen Sie Ihre Email
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        Wir haben Ihnen einen magischen Link an{" "}
                        <b className="text-primary-600">{email}</b> gesendet.
                        Klicken Sie diesen um sich anzumelden.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <span className="flex w-full rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setInterval(undefined)
                        setModal("closed")
                      }}
                      className="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5"
                    >
                      Abbrechen
                    </button>
                  </span>
                </div>
              </>
            )}
          </Modal>
        ) : null}
      </AnimatePresence>
    </>
  )
}
