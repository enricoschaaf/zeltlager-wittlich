import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const Register = () => (
  <div className="prose h-full grid m-auto">
    <h1 className="self-center">
      Das Zeltlager 2023 ist ausgebucht. 2024 geht es vom 04.08. - 14.08. nach
      Wershofen.
    </h1>
  </div>
)

Register.getLayout = (page: NextPage) => (
  <Layout title="Anmelden">
    <main className="h-full max-w-7xl mx-auto sm:px-6 lg:px-8">{page}</main>
  </Layout>
)

export default Register
