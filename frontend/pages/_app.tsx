import { Layout } from "components/Layout"
import LogRocket from "logrocket"
import { AppProps } from "next/app"
import "../styles/index.css"

LogRocket.init("pztxki/zeltlager-website")

const App = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
)

export default App
