import { LoginForm } from "components/LoginForm"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Login"),
}

const Login = () => {
  return <LoginForm />
}

export default Login
