import LogRocket from "logrocket"
import { NextComponentType } from "next"
import { AppProps as NextAppProps } from "next/app"
import "../styles/index.css"

interface AppProps extends NextAppProps {
  Component: NextComponentType & {
    getLayout?: (component: JSX.Element) => JSX.Element
  }
}

if (process.env.NODE_ENV === "production") {
  LogRocket.init("pztxki/zeltlager-website")
}

const App = ({ Component, pageProps }: AppProps) => {
  const getLayout = Component.getLayout || (page => page)
  return <>{getLayout(<Component {...pageProps} />)}</>
}

export default App
