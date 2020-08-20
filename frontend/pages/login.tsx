import { LoginForm } from "components/LoginForm"
import { useAuth } from "hooks/useAuth"
import { Layout } from "layouts/Layout"

const Login = () => {
  useAuth()
  return <LoginForm />
}

Login.getLayout = page => (
  <Layout title="Login">
    <main className="h-full">{page}</main>
  </Layout>
)

export default Login
