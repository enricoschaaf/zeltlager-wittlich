import axios from "axios"
import { AnimatePresence } from "framer-motion"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { Button, Input, Modal } from "tailwindcss/ui"
import { setAccessToken } from "utils/accessToken"
import { emailRegex } from "utils/regex"

async function signInMutation(email: string) {
  const { data } = await axios.post("/api/auth/signin", {
    email,
  })
  return data
}

async function refreshQuery(tokenId: string) {
  const { data } = await axios.get("/api/auth/refresh/" + tokenId)
  return data
}

export const LoginForm = () => {
  const [modal, setModal] = useState<"closed" | "open">("closed")
  const [interval, setInterval] = useState<500 | undefined>(500)
  const { push, query } = useRouter()
  const [email, setEmail] = useState<string>("")
  const { register, handleSubmit, errors, setError } = useForm()
  const [mutate, { data, isLoading }] = useMutation(signInMutation, {
    onSuccess: () => setModal("open"),
    onError: (err: any) => {
      console.dir(err)
      if (err.response.status === 404) {
        setError("email", {
          type: "validate",
          message: "Wir konnten kein Konto mit dieser Email Adresse finden.",
        })
      }
    },
  })
  const { status: queryStatus } = useQuery(data?.tokenId, refreshQuery, {
    refetchInterval: interval,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: data,
    onSuccess: ({ accessToken }) => {
      if (accessToken) {
        setAccessToken(data.accessToken)
        push(typeof query.redirect === "string" ? query.redirect : "/profile")
      }
    },
  })

  async function onSubmit({ email }: { email: string }) {
    setEmail(email)
    mutate(email)
  }

  return (
    <>
      <form
        className="grid gap-4 w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="email"
          label={{ value: "Email", visibility: "hidden" }}
          inputMode="email"
          autoComplete="email"
          placeholder="Email Adresse"
          errors={errors}
          register={register({
            required: "Bitte geben Sie Ihre Email Ad­res­se an.",
            pattern: {
              value: emailRegex,
              message: "Ihre Email Ad­res­se hat nicht das richtige Format.",
            },
          })}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <svg
              className="animate-spin -mr-1 ml-3 h-5 w-5 text-white"
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
            {queryStatus === "error" ? (
              <>
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="text-yellow-600 w-6 h-6"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Magischer Link abgelaufen
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        Wir senden Ihnen einen neuen magischen Link an{" "}
                        <b className="text-indigo-600">{email}</b>. Klicken Sie
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
                      className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    >
                      Erneut senden
                    </button>
                  </span>
                  <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-1">
                    <button
                      type="button"
                      onClick={() => {
                        setInterval(undefined)
                        setModal("closed")
                      }}
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    >
                      Abbrechen
                    </button>
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="text-indigo-600 w-6 h-6"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Bestätigen Sie Ihre Email
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        Wir haben Ihnen einen magischen Link an{" "}
                        <b className="text-indigo-600">{email}</b> gesendet.
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
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
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
