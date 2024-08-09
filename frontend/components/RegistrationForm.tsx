"use client"
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid"
import axios from "axios"
import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import { config } from "project.config"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { Button, Checkbox, Input, Modal, Radio, Dropdown } from "tailwindcssUi"
import { InputWithButton } from "tailwindcssUi/InputWithButton"
import { Textarea } from "tailwindcssUi/Textarea"
import { emailRegex, postalCodeRegex } from "utils/regex"

async function registerMutation(body: any) {
  const { data } = await axios.post("/api/register", body)
  return data
}

export const RegistrationForm = () => {
  const [status, setStatus] = useState<"success" | "waiting" | "closed">(
    "closed",
  )
  const { mutateAsync, isLoading } = useMutation(registerMutation)
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    control,
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      phoneNumbers: [{ value: "" }],
      medications: [{ value: "" }],
    },
  })
  const {
    fields: phoneNumbersFields,
    append: appendPhoneNumber,
    remove: removePhoneNumber,
  } = useFieldArray({
    control,
    name: "phoneNumbers",
    rules: { minLength: 1, required: true },
  })

  const {
    fields: medicationsFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control,
    name: "medications",
    rules: { minLength: 1, required: true },
  })

  useEffect(() => {
    if (status !== "closed") {
      reset()
    }
  }, [reset, status])

  const errors = Object.fromEntries(
    Object.entries(formErrors)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((error, i) => [`${key}.${i}.value`, error?.value])
        }

        return [[key, value]]
      })
      .flat(),
  )

  return (
    <>
      <form
        className="flex flex-col"
        onSubmit={handleSubmit(async (data) => {
          const { status } = await mutateAsync({
            ...data,
            acceptTerms: undefined,
            phoneNumbers: data.phoneNumbers.map((p) => p.value).filter(Boolean),
            medications: data.medications.map((m) => m.value).filter(Boolean),
          })
          setStatus(status)
        })}
      >
        <div>
          <div className="mt-5">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                  <Input
                    label="Vorname"
                    className="col-span-6 sm:col-span-5"
                    autoComplete="given-name"
                    errors={errors}
                    {...register("firstName", {
                      required: "Bitte geben Sie den Vornamen Ihres Kindes an.",
                    })}
                  />
                  <Input
                    label="Nachname"
                    className="col-span-6 sm:col-span-5"
                    autoComplete="family-name"
                    errors={errors}
                    {...register("lastName", {
                      required:
                        "Bitte geben Sie den Nachnamen Ihres Kindes an.",
                    })}
                  />
                  <Dropdown
                    label="Geschlecht"
                    className="col-span-3 sm:col-span-2"
                    {...register("gender")}
                  />
                  <Input
                    label="Geburtsdatum"
                    className="col-span-9 sm:col-span-4"
                    autoComplete="bday"
                    errors={errors}
                    {...register("birthDate", {
                      required:
                        "Bitte geben Sie das Geburtsdatum Ihres Kindes an.",
                      validate: (value) => {
                        const [day, month, year] = value.split(".")
                        const birthDate = new Date(`${month}/${day}/${year}`)

                        if (!birthDate.getTime()) {
                          return "Das angegebene Geburtsdatum hat nicht das richtige Format. Bitte geben Sie das Geburtsdatum im Format TT.MM.JJJJ an."
                        }

                        const age =
                          (new Date(config.startDate).getTime() -
                            birthDate.getTime()) /
                          (1000 * 60 * 60 * 24 * 365.25)

                        if (age < 8) {
                          return "Das Mindestalter ist 8 Jahre. Ihr Kind ist leider noch zu jung."
                        }

                        if (age >= 17) {
                          return "Das Maximalalter ist 16 Jahre. Ihr Kind ist leider zu alt."
                        }
                      },
                    })}
                  />
                  <Input
                    label="Straße und Hausnummer"
                    className="col-span-12 sm:col-span-8"
                    autoComplete="address-line1"
                    errors={errors}
                    {...register("streetAddress", {
                      required:
                        "Bitte geben Sie Ihre Straße und Hausnummer an.",
                    })}
                  />
                  <Input
                    label="PLZ"
                    className="col-span-12 sm:col-span-6"
                    inputMode="decimal"
                    autoComplete="postal-code"
                    errors={errors}
                    {...register("postalCode", {
                      required: "Bitte geben Sie Ihre Postleitzahl an.",
                      pattern: {
                        value: postalCodeRegex,
                        message:
                          "Ihre Postleitzahl hat nicht das richtige Format.",
                      },
                    })}
                  />
                  <Input
                    label="Stadt"
                    className="col-span-12 sm:col-span-6"
                    autoComplete="address-level2"
                    errors={errors}
                    {...register("city", {
                      required: "Bitte geben Sie Ihre Stadt an.",
                    })}
                  />
                  <div className="col-span-12 sm:col-span-6 space-y-2">
                    {phoneNumbersFields.map((field, index) => (
                      <InputWithButton
                        key={field.id}
                        onClick={() =>
                          phoneNumbersFields.length - index === 1
                            ? appendPhoneNumber({ value: "" })
                            : removePhoneNumber(index)
                        }
                        description=""
                        label={
                          index === 0
                            ? "Telefonnummer zur Erreichbarkeit während des Zeltlagers (gerne mehrere angeben)"
                            : {
                                value:
                                  "Telefonnummer zur Erreichbarkeit während des Zeltlagers (gerne mehrere angeben)",
                                visibility: "hidden",
                              }
                        }
                        icon={
                          phoneNumbersFields.length - index === 1 ? (
                            <PlusIcon
                              className="-ml-0.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          ) : (
                            <XMarkIcon
                              className="-ml-0.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          )
                        }
                        inputMode="tel"
                        autoComplete="tel-national"
                        errors={errors}
                        {...register(`phoneNumbers.${index}.value`, {
                          required:
                            index === 0
                              ? "Bitte geben Sie eine Telefonnumber an."
                              : undefined,
                        })}
                      />
                    ))}
                  </div>
                  <Input
                    label="Email der Eltern"
                    className="col-span-12 sm:col-span-6"
                    inputMode="email"
                    autoComplete="email"
                    errors={errors}
                    {...register("email", {
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
                        id="none"
                        label="Keine"
                        {...register("eatingHabits")}
                        defaultChecked
                      />
                      <Radio
                        id="vegetarian"
                        label="Vegetarisch"
                        {...register("eatingHabits")}
                      />
                      <Radio
                        id="vegan"
                        label="Vegan"
                        {...register("eatingHabits")}
                      />
                    </div>
                  </fieldset>
                  <Textarea
                    label="Lebensmittelunterträglichkeiten"
                    description="Bitte listen Sie die Lebensmittelunterträglichkeiten Ihres Kindes."
                    className="col-span-12"
                    {...register("foodIntolerances")}
                  />
                  <Checkbox
                    label="Schwimmen"
                    description="Unser Kind ist Schwimmer/in und kann ohne Aufsicht schwimmen."
                    className="col-span-12"
                    {...register("canSwim")}
                  />
                  <Checkbox
                    label="Aufsicht"
                    description="Unser Kind darf mit der Gruppe in abgesprochenen Zeiträumen einige Stunden zur freien Verfügung haben, in denen er/sie ohne Aufsicht ist."
                    className="col-span-12"
                    {...register("supervision")}
                  />
                  <Checkbox
                    label="1. Hilfe"
                    description="Die Betreuenden dürfen für die 1. Hilfe-Versorgung Pflaster, Desinfektionsmittel, Wundsalbe,
                    Brandsalbe oder Zeckenzange verwenden."
                    className="col-span-12"
                    {...register("firstAid")}
                  />
                  <Textarea
                    label="Krankheiten"
                    description="Bitte listen Sie die Krankheiten Ihres Kindes auf."
                    className="col-span-12"
                    {...register("diseases")}
                  />
                  <Textarea
                    label="Allergien"
                    description="Bitte listen Sie die Allergien Ihres Kindes auf."
                    className="col-span-12"
                    {...register("allergies")}
                  />
                  <div className="col-span-12 space-y-2">
                    {medicationsFields.map((field, index) => (
                      <InputWithButton
                        key={field.id}
                        errors={errors}
                        onClick={() =>
                          medicationsFields.length - index === 1
                            ? appendMedication({ value: "" })
                            : removeMedication(index)
                        }
                        label={
                          index === 0
                            ? "Medikamente"
                            : {
                                value: "Medikamente",
                                visibility: "hidden",
                              }
                        }
                        icon={
                          medicationsFields.length - index === 1 ? (
                            <PlusIcon
                              className="-ml-0.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          ) : (
                            <XMarkIcon
                              className="-ml-0.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          )
                        }
                        description={
                          index === 0
                            ? `Bitte listen Sie alle Medikamente mit Einnahmefrequenz und -anweisungen auf, die ihr Kind einnehmen muss.
                        `
                            : undefined
                        }
                        {...register(`medications.${index}.value`)}
                      />
                    ))}
                  </div>
                  <Input
                    label="Name des Hausarztes"
                    className="col-span-12 sm:col-span-6"
                    autoComplete="nope"
                    errors={errors}
                    {...register("familyDoctorName", {
                      required:
                        "Bitte geben Sie den Namen des Hausarztes ihres Kindes an.",
                    })}
                  />
                  <Input
                    label="Telefonnummer des Hausarztes"
                    className="col-span-12 sm:col-span-6"
                    inputMode="tel"
                    autoComplete="nope"
                    errors={errors}
                    {...register("familyDoctorPhone", {
                      required:
                        "Bitte geben Sie die Telefonummer des Hausarztes ihres Kindes an.",
                    })}
                  />
                  <Input
                    label="Unser Kind ist bei folgender Krankenkasse versichert"
                    className="col-span-12"
                    autoComplete="nope"
                    errors={errors}
                    {...register("healthInsurance", {
                      required:
                        "Bitte geben Sie die Krankenkasse Ihres Kindes an.",
                    })}
                  />
                  <Input
                    label="Unser Kind möchte mit diesen Kindern in eine Gruppe"
                    description="Wir werden versuchen dies zu berücksichtigen."
                    className="col-span-12"
                    autoComplete="nope"
                    errors={errors}
                    {...register("groupWith")}
                  />
                  <Checkbox
                    label={
                      <>
                        Hiermit melde ich mein Kind für das Zeltlager{" "}
                        {config.year} an und akzeptiere damit die{" "}
                        <Link
                          href="/teilnahmebedingungen"
                          className="underline font-bold"
                          target="_blank"
                        >
                          Teilnahmebedingungen
                        </Link>
                        .
                      </>
                    }
                    className="col-span-12"
                    {...register("acceptTerms", { required: true })}
                  />
                  <Checkbox
                    label="KjG - Mitglied"
                    className="col-span-12"
                    {...register("kjgMember")}
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
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary sm:text-sm sm:leading-5"
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
  postalCode: string
  streetAddress: string
  supervision: boolean
  groupWith: string
  acceptTerms: boolean
  kjgMember: boolean
  medications: { value: string }[]
  firstAid: boolean
  gender: "W" | "M" | "D"
  phoneNumbers: { value: string }[]
}
