import { RegistrationForm } from "components/RegistrationForm"
import { Layout } from "layouts/Layout"

const Register = () => <RegistrationForm />

Register.getLayout = page => (
  <Layout title="Anmelden">
    <main className="h-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {page}
    </main>
  </Layout>
)

export default Register
