import axios from "axios"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { Button, Input } from "tailwindcss/ui"
import { setAccessToken } from "utils/accessToken"
import { emailRegex } from "utils/regex"

async function onSubmit({ email }, back) {
  try {
    const {
      data: { tokenId },
    } = await axios.post("/api/signin", {
      email,
    })

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const [{ data }] = await Promise.all([
        axios.get("/api/refresh/" + tokenId),
        new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 500)
        }),
      ])
      if (data.accessToken) {
        setAccessToken(data.accessToken)
        return back()
      }
    }
  } catch (err) {
    console.error(err)
  }
}

export const LoginForm = () => {
  const { back } = useRouter()
  const { register, handleSubmit, errors } = useForm()
  return (
    <form
      onSubmit={handleSubmit((data: { email: string }) => onSubmit(data, back))}
    >
      <div className="grid gap-4">
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
        <Button type="submit">Anmelden</Button>
      </div>
    </form>
  )
}
