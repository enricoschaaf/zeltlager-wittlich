import { LoginForm } from "components/LoginForm"
import { useAuth } from "hooks/useAuth"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Login"),
}

const Login = () => {
  useAuth()
  return <LoginForm />
}

export default Login
