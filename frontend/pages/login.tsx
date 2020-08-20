import { LoginForm } from "components/LoginForm"
import { useAuth } from "hooks/useAuth"
import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const Login = () => {
  useAuth()
  return <LoginForm />
}

Login.getLayout = (page: NextPage) => (
  <Layout title="Login">
    <main className="flex justify-center items-center h-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {page}
    </main>
  </Layout>
)

export default Login
