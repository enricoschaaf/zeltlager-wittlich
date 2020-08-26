import { RegistrationForm } from "components/RegistrationForm"
import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const Register = () => <RegistrationForm />

Register.getLayout = (page: NextPage) => (
  <Layout title="Anmelden">
    <main className="h-full max-w-7xl mx-auto sm:px-6 lg:px-8">{page}</main>
  </Layout>
)

export default Register
