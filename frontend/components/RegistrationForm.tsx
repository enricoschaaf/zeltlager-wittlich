import axios from "axios"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, Input, Modal } from "tailwindcss/ui"
import { Textarea } from "tailwindcss/ui/Textarea"
import { emailRegex, mobilePhoneRegex, postalCodeRegex } from "utils/regex"

export const RegistrationForm = () => {
  const [status, setStatus] = useState<"success" | "waiting" | "closed">(
    "closed",
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
        className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8"
      >
        <Input
          name="firstName"
          label="Vorname"
          className="col-span-12 sm:col-span-6"
          autoComplete="given-name"
          register={register({ required: true })}
        />
        <Input
          name="lastName"
          label="Nachname"
          className="col-span-12 sm:col-span-6"
          autoComplete="family-name"
          register={register({ required: true })}
        />
        <Input
          name="birthDate"
          label="Geburtsdatum"
          className="col-span-12 sm:col-span-4"
          inputMode="decimal"
          autoComplete="bday"
          register={register({
            required: true,
          })}
        />
        <Input
          name="streetAddress"
          label="Straße und Hausnummer"
          className="col-span-12 sm:col-span-8"
          autoComplete="address-line1"
          register={register({ required: true })}
        />
        <Input
          name="postalCode"
          label="PLZ"
          className="col-span-12 sm:col-span-4"
          inputMode="decimal"
          autoComplete="postal-code"
          register={register({
            required: true,
            pattern: postalCodeRegex,
          })}
        />
        <Input
          name="city"
          label="Stadt"
          className="col-span-12 sm:col-span-8"
          autoComplete="address-level2"
          register={register({ required: true })}
        />
        <Input
          name="mobile"
          label="Handy"
          className="col-span-12 sm:col-span-4"
          inputMode="tel"
          autoComplete="tel-national"
          register={register({
            required: true,
            pattern: mobilePhoneRegex,
          })}
        />
        <Input
          name="email"
          label="Email"
          className="col-span-12 sm:col-span-8"
          inputMode="email"
          autoComplete="email"
          register={register({
            required: true,
            pattern: emailRegex,
            validate: async value => {
              const {
                data: { valid },
              } = await axios.get("/api/validate/" + value)
              return valid
            },
          })}
        />
        {/* <fieldset className="col-span-12">
          <legend className="text-base font-medium text-gray-900">
            Essensgewohnheiten
          </legend>
          <div className="grid grid-flow-row sm:grid-flow-col gap-4 sm:gap-6 lg:gap-8 mt-2 sm:mt-3 lg:mt-4">
            <Radio
              name="eatingHabits"
              id="noSpecialties"
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
        </fieldset> */}
        <Textarea
          label="Lebensmittelunterträglichkeiten"
          description="Bitte listen Sie die Lebensmittelunterträglichkeiten ihres Kindes."
          name="foodIntolerances"
          className="col-span-12"
          register={register()}
        />
        {/* <Checkbox
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
        /> */}
        <Textarea
          label="Krankheiten"
          description="Bitte listen Sie die Krankheiten ihres Kindes auf."
          name="diseases"
          className="col-span-12"
          register={register()}
        />
        <Textarea
          label="Allergien"
          description="Bitte listen Sie die Allergien ihres Kindes auf."
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
          className="self-end col-span-12 sm:col-span-8"
          autoComplete="nope"
          register={register({ required: true })}
        />
        <Input
          name="familyDoctorPhone"
          label="Telefonnummer des Hausarztes"
          className="col-span-12 sm:col-span-4"
          inputMode="tel"
          autoComplete="nope"
          register={register({ required: true })}
        />
        <Input
          name="healthInsurance"
          label="Unser Kind ist bei folgender Krankenkasse versichert"
          className="col-span-12"
          autoComplete="nope"
          register={register({ required: true })}
        />
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
