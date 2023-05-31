import axios from "axios"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { Button, Checkbox, Input, Modal, Radio, Dropdown } from "tailwindcss/ui"
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

  async function onSubmit(data: FormData) {
    const { status } = await mutate({ ...data, acceptTerms: undefined })
    setStatus(status)
  }

  useEffect(() => {
    if (status !== "closed") {
      reset()
    }
  }, [reset, status])
  return (
    <>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mt-5">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                  <Input
                    name="firstName"
                    label="Vorname"
                    className="col-span-5"
                    autoComplete="given-name"
                    errors={errors}
                    register={register({
                      required: "Bitte geben Sie den Vornamen Ihres Kindes an.",
                    })}
                  />
                  <Input
                    name="lastName"
                    label="Nachname"
                    className="col-span-5"
                    autoComplete="family-name"
                    errors={errors}
                    register={register({
                      required:
                        "Bitte geben Sie den Nachnamen Ihres Kindes an.",
                    })}
                  />
                  <Dropdown
                    name="gender"
                    label="Geschlecht"
                    className="col-span-2"
                    register={register({
                      required:
                        "Bitte geben Sie das Geschlect Ihres Kindes an.",
                    })}
                  />
                  <Input
                    name="birthDate"
                    label="Geburtsdatum"
                    className="col-span-12 sm:col-span-4"
                    autoComplete="bday"
                    errors={errors}
                    register={register({
                      required:
                        "Bitte geben Sie das Geburtsdatum Ihres Kindes an.",
                      validate: (value) => {
                        const [day, month, year] = value.split(".")
                        if (
                          isNaN(new Date(`${month}/${day}/${year}`).getTime())
                        ) {
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
                      required:
                        "Bitte geben Sie Ihre Straße und Hausnummer an.",
                    })}
                  />
                  <Input
                    name="postalCode"
                    label="PLZ"
                    className="col-span-12 sm:col-span-6"
                    inputMode="decimal"
                    autoComplete="postal-code"
                    errors={errors}
                    register={register({
                      required: "Bitte geben Sie Ihre Postleitzahl an.",
                      pattern: {
                        value: postalCodeRegex,
                        message:
                          "Ihre Postleitzahl hat nicht das richtige Format.",
                      },
                    })}
                  />
                  <Input
                    name="city"
                    label="Stadt"
                    className="col-span-12 sm:col-span-6"
                    autoComplete="address-level2"
                    errors={errors}
                    register={register({
                      required: "Bitte geben Sie Ihre Stadt an.",
                    })}
                  />
                  <Input
                    name="mobile"
                    label="Handy"
                    className="col-span-12 sm:col-span-6"
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
                    className="col-span-12 sm:col-span-6"
                    inputMode="email"
                    autoComplete="email"
                    errors={errors}
                    register={register({
                      required: "Bitte geben Sie Ihre Email Ad­res­se an.",
                      pattern: {
                        value: emailRegex,
                        message:
                          "Ihre Email Ad­res­se hat nicht das richtige Format.",
                      },
                    })}
                  />
                  <fieldset className="col-span-6">
                    <legend className="text-base font-medium text-gray-900">
                      Essensgewohnheiten
                    </legend>
                    <div className="grid grid-flow-row gap-4 mt-2 sm:grid-flow-col sm:gap-12 sm:mt-6">
                      <Radio
                        name="eatingHabits"
                        id="none"
                        label="Keine"
                        register={register()}
                        defaultChecked
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
                    description="Unser Kind darf mit der Gruppe in abgesprochenen Zeiträumen einige Stunden zur freien Verfügung haben, in denen er/sie ohne Aufsicht ist."
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
                    name="medication"
                    className="col-span-12"
                    register={register()}
                  />
                  <Input
                    name="familyDoctorName"
                    label="Name des Hausarztes"
                    className="col-span-12 sm:col-span-6"
                    autoComplete="nope"
                    errors={errors}
                    register={register({
                      required:
                        "Bitte geben Sie den Namen des Hausarztes ihres Kindes an.",
                    })}
                  />
                  <Input
                    name="familyDoctorPhone"
                    label="Telefonnummer des Hausarztes"
                    className="col-span-12 sm:col-span-6"
                    inputMode="tel"
                    autoComplete="nope"
                    errors={errors}
                    register={register({
                      required:
                        "Bitte geben Sie die Telefonummer des Hausarztes ihres Kindes an.",
                    })}
                  />
                  <Input
                    name="healthInsurance"
                    label="Unser Kind ist bei folgender Krankenkasse versichert"
                    className="col-span-12"
                    autoComplete="nope"
                    errors={errors}
                    register={register({
                      required:
                        "Bitte geben Sie die Krankenkasse Ihres Kindes an.",
                    })}
                  />
                  <Input
                    name="groupWith"
                    label="Unser Kind möchte mit diesen Kindern in eine Gruppe"
                    description="Wir werden versuchen dies zu berücksichtigen."
                    className="col-span-12"
                    autoComplete="nope"
                    errors={errors}
                    register={register()}
                  />
                  <Checkbox
                    name="acceptTerms"
                    label="Hiermit melde ich mein Kind für das Zeltlager 2023 an und bestätige ich, dass die von mir gemachten Angaben korrekt sind."
                    className="col-span-12"
                    register={register({ required: true })}
                  />
                  <Checkbox
                    name="kjgMember"
                    label="KjG - Mitglied"
                    className="col-span-12"
                    register={register()}
                  />
                  <div className="grid grid-cols-6 gap-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="self-end w-full sm:w-32">
          <Button
            type="submit"
            className="px-4 mt-5 sm:px-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 ml-2 text-white animate-spin"
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
        </span>
      </form>
      {status !== "closed" && (
        <AnimatePresence>
          <Modal>
            <div>
              <div
                className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  status === "success" ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                <svg
                  className={`h-6 w-6 ${
                    status === "success" ? "text-green-600" : "text-yellow-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {status === "success" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3
                  className="text-lg font-medium leading-6 text-gray-900"
                  id="modal-headline"
                >
                  {status === "success"
                    ? "Anmeldung erfolgreich"
                    : "Anmeldung auf der Warteliste"}
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-500">
                    {status === "success"
                      ? "Ihre Anmeldung war erfolgreich. Sie erhalten weitere Informationen per Email."
                      : "Zur Zeit sind alle Plätze belegt, daher wurde Ihre Anmeldung der Warteliste hinzugefügt. Sie erhalten weitere Informationen per Email."}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <span className="flex w-full rounded-md shadow-sm">
                <button
                  onClick={() => setStatus("closed")}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-emerald-600 border border-transparent rounded-md shadow-sm hover:bg-emerald-500 focus:outline-none focus:border-emerald-700 focus:shadow-outline-emerald sm:text-sm sm:leading-5"
                >
                  Zurück zum Anmelden
                </button>
              </span>
            </div>
          </Modal>
        </AnimatePresence>
      )}
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
  groupWith: string
}
