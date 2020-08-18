import { Layout } from "components/Layout"
import { AppProps } from "next/app"
import "../styles/index.css"

const App = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
)

export default App
