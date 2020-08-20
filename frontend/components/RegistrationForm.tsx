import axios from "axios"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { Button, Checkbox, Input, Modal, Radio } from "tailwindcss/ui"
import { Textarea } from "tailwindcss/ui/Textarea"
import { emailRegex, postalCodeRegex } from "utils/regex"

async function registerMutation(body: any) {
  const { data } = await axios.post("/api/register", body)
  return data
}

export const RegistrationForm = () => {
  const [status, setStatus] = useState<"success" | "waiting" | "closed">(
    "closed",
  )
  const [mutate, { isLoading }] = useMutation(registerMutation)
  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onBlur",
  })

  async function onSubmit(formData: FormData) {
    const data = Object.fromEntries(
      Object.entries(formData).map(([key, value]) =>
        value === "" ? [key, undefined] : [key, value],
      ),
    )
    const [day, month, year] = data.birthDate.split(".")
    const birthDate = new Date(`${month}/${day}/${year}`)
    const { status } = await mutate({ ...data, birthDate })
    reset()
    setStatus(status)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-4 sm:gap-6"
      >
        <Input
          name="firstName"
          label="Vorname"
          className="col-span-12 sm:col-span-6"
          autoComplete="given-name"
          errors={errors}
          register={register({
            required: "Bitte geben Sie den Vornamen Ihres Kindes an.",
          })}
        />
        <Input
          name="lastName"
          label="Nachname"
          className="col-span-12 sm:col-span-6"
          autoComplete="family-name"
          errors={errors}
          register={register({
            required: "Bitte geben Sie den Nachnamen Ihres Kindes an.",
          })}
        />
        <Input
          name="birthDate"
          label="Geburtsdatum"
          className="col-span-12 sm:col-span-4"
          inputMode="decimal"
          autoComplete="bday"
          errors={errors}
          register={register({
            required: "Bitte geben Sie das Geburtsdatum Ihres Kindes an.",
            validate: (value) => {
              const [day, month, year] = value.split(".")
              if (isNaN(new Date(`${month}/${day}/${year}`).getTime())) {
                return "Das angegebene Geburtsdatum hat nicht das richtige Format."
              }
            },
          })}
        />
        <Input
          name="streetAddress"
          label="Straße und Hausnummer"
          className="col-span-12 sm:col-span-8"
          autoComplete="address-line1"
          errors={errors}
          register={register({
            required: "Bitte geben Sie Ihre Straße und Hausnummer an.",
          })}
        />
        <Input
          name="postalCode"
          label="PLZ"
          className="col-span-12 sm:col-span-4"
          inputMode="decimal"
          autoComplete="postal-code"
          errors={errors}
          register={register({
            required: "Bitte geben Sie Ihre Postleitzahl an.",
            pattern: {
              value: postalCodeRegex,
              message: "Ihre Postleitzahl hat nicht das richtige Format.",
            },
          })}
        />
        <Input
          name="city"
          label="Stadt"
          className="col-span-12 sm:col-span-8"
          autoComplete="address-level2"
          errors={errors}
          register={register({
            required: "Bitte geben Sie Ihre Stadt.",
          })}
        />
        <Input
          name="mobile"
          label="Handy"
          className="col-span-12 sm:col-span-4"
          inputMode="tel"
          autoComplete="tel-national"
          errors={errors}
          register={register({
            required: "Bitte geben Sie Ihre Handynummer an.",
          })}
        />
        <Input
          name="email"
          label="Email"
          className="col-span-12 sm:col-span-8"
          inputMode="email"
          autoComplete="email"
          errors={errors}
          register={register({
            required: "Bitte geben Sie Ihre Email Ad­res­se an.",
            pattern: {
              value: emailRegex,
              message: "Ihre Email Ad­res­se hat nicht das richtige Format.",
            },
          })}
        />
        <fieldset className="col-span-12">
          <legend className="text-base font-medium text-gray-900">
            Essensgewohnheiten
          </legend>
          <div className="grid grid-flow-row sm:grid-flow-col gap-4 sm:gap-6 mt-2 sm:mt-3">
            <Radio
              name="eatingHabits"
              id="none"
              label="Keine"
              register={register()}
              checked
            />
            <Radio
              name="eatingHabits"
              id="vegetarian"
              label="Vegetarisch"
              register={register()}
            />
            <Radio
              name="eatingHabits"
              id="vegan"
              label="Vegan"
              register={register()}
            />
          </div>
        </fieldset>
        <Textarea
          label="Lebensmittelunterträglichkeiten"
          description="Bitte listen Sie die Lebensmittelunterträglichkeiten Ihres Kindes."
          name="foodIntolerances"
          className="col-span-12"
          register={register()}
        />
        <Checkbox
          name="canSwim"
          label="Schwimmen"
          description="Unser Kind ist Schwimmer/in und kann ohne Aufsicht schwimmen."
          className="col-span-12"
          register={register()}
        />
        <Checkbox
          name="supervision"
          label="Aufsicht"
          description=" Wir sind damit einverstanden, dass unser Kind in mit der Gruppe abgesprochenen Zeiträumen gelegentlich einige Stunden zur freien Verfügung hat, in der er/sie ohne Aufsicht ist."
          className="col-span-12"
          register={register()}
        />
        <Textarea
          label="Krankheiten"
          description="Bitte listen Sie die Krankheiten Ihres Kindes auf."
          name="diseases"
          className="col-span-12"
          register={register()}
        />
        <Textarea
          label="Allergien"
          description="Bitte listen Sie die Allergien Ihres Kindes auf."
          name="allergies"
          className="col-span-12"
          register={register()}
        />
        <Textarea
          label="Medikamente"
          description="Bitte listen Sie die Medikamente auf, die ihr Kind einnehmen muss."
          name="health"
          className="col-span-12"
          register={register()}
        />
        <Input
          name="familyDoctorName"
          label="Name des Hausarztes"
          className="col-span-12 sm:col-span-7"
          autoComplete="nope"
          errors={errors}
          register={register({
            required:
              "Bitte geben Sie den Name des Hausarztes Ihres Kindes an.",
          })}
        />
        <Input
          name="familyDoctorPhone"
          label="Telefonnummer des Hausarztes"
          className="col-span-12 sm:col-span-5"
          inputMode="tel"
          autoComplete="nope"
          errors={errors}
          register={register({
            required:
              "Bitte geben Sie die Telefonnummer des Hausarztes Ihres Kindes an.",
          })}
        />
        <Input
          name="healthInsurance"
          label="Unser Kind ist bei folgender Krankenkasse versichert"
          className="col-span-12"
          autoComplete="nope"
          errors={errors}
          register={register({
            required: "Bitte geben Sie die Krankenkasse Ihres Kindes an.",
          })}
        />
        <Button type="submit" className="col-span-12" disabled={isLoading}>
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
            description="Zur Zeit sind alle Plätze belegt, daher wurde Ihre Anmeldung der Warteliste hinzugefügt. Sie erhalten weitere Informationen per Email."
            buttonOnClick={() => setStatus("closed")}
            buttonText="Zurück zum Anmelden"
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}

interface FormData {
  allergies: string
  birthDate: string
  canSwim: boolean
  city: string
  diseases: string
  eatingHabits: string
  email: string
  familyDoctorName: string
  familyDoctorPhone: string
  firstName: string
  foodIntolerances: string
  health: string
  healthInsurance: string
  lastName: string
  mobile: string
  postalCode: string
  streetAddress: string
  supervision: boolean
}
