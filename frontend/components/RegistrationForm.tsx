import axios from "axios"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, Modal } from "tailwindcss/ui"

export const RegistrationForm = () => {
  const [status, setStatus] = useState<"success" | "waiting" | "closed">(
    "closed"
  )
  const { register, handleSubmit } = useForm()

  const onSubmit = async (formData: any) => {
    const { data } = await axios.post("/api/register", JSON.stringify(formData))
    setStatus(data.status)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 grid gap-4 sm:gap-6 lg:gap-8"
      >
        <Button type="submit" className="col-span-12">
          Anmelden
        </Button>
      </form>
      <AnimatePresence>
        {status === "success" ? (
          <Modal
            status="success"
            headline="Anmeldung erfolgreich"
            description="Ihre Anmeldung war erfolgreich. Sie erhalten weitere Informationen per Email."
            buttonOnClick={() => setStatus("closed")}
            buttonText="Zurück zum Anmelden"
          />
        ) : status === "waiting" ? (
          <Modal
            status="warn"
            headline="Anmeldung auf der Warteliste"
            description="Zur Zeit sind alle Plätze belegt, daher wurde ihre Anmeldung der Warteliste hinzugefügt. Sie erhalten weitere Informationen per Email."
            buttonOnClick={() => setStatus("closed")}
            buttonText="Zurück zum Anmelden"
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
