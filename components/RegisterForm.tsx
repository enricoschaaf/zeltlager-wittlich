import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Button,
  Checkbox,
  Input,
  Radio,
  Textarea,
  useModal,
} from "tailwindcss/ui"

export const RegisterForm = () => {
  const [status, setStatus] = useState<"success" | "waiting">("success")
  const { Modal, setModal } = useModal()
  const { register, handleSubmit } = useForm()
  const onSubmit = async (data: any) => {
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    setModal("open")
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 grid gap-4 sm:gap-6 lg:gap-8 grid-cols-12"
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
            validate: (value: string) => {
              const [day, month, year] = value.split(".")
              const date = new Date(month + "/" + day + "/" + year)
              if (
                date > new Date("08/17/2005") &&
                date < new Date("08/17/2012")
              ) {
                return true
              }
              return false
            },
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
            pattern: /^\d{5}$/,
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
            pattern: /^(\+49)?0?1(5[0-25-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7}$/,
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
            pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
            validate: async value => {
              const res = await fetch("/api/validate/" + value)
              const { valid }: { valid: boolean } = await res.json()
              return valid
            },
          })}
        />
        <fieldset className="col-span-12">
          <legend className="text-base font-medium text-gray-900">
            Essensgewohnheiten
          </legend>
          <div className="grid grid-flow-row sm:grid-flow-col gap-4 sm:gap-6 lg:gap-8 mt-2 sm:mt-3 lg:mt-4">
            <Radio
              name="eatingHabits"
              id="noSpecialties"
              label="Keine Besonderheiten"
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
            <Radio
              name="eatingHabits"
              id="others"
              label="Andere"
              register={register()}
            />
          </div>
        </fieldset>
        <Textarea
          label="Lebensmittelunterträglichkeiten"
          description="Bitte listen Sie Lebensmittelunterträglichkeiten ihres Kindes."
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
          className="col-span-12 sm:col-span-8"
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
        <Button
          type="submit"
          className="col-span-12"
          onClick={() => setModal("open")}
        >
          Anmelden
        </Button>
      </form>
      {status === "success" ? (
        <Modal
          status="success"
          headline="Anmeldung erfolgreich"
          description="Ihre Anmeldung war erfolgreich. Sie erhalten in Kürze weitere Informationen per Email."
          buttonText="Zurück zum Anmelden"
        />
      ) : (
        <Modal
          status="warn"
          headline="Anmeldung erfolgreich"
          description="Ihre Anmeldung war erfolgreich. Sie erhalten in Kürze weitere Informationen per Email."
          buttonText="Zurück zum Anmelden"
        />
      )}
    </>
  )
}
