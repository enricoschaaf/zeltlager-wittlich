import ErrorComponent from "components/Error"
import LogRocket from "logrocket"
import { NextComponentType } from "next"
import { AppProps as NextAppProps } from "next/app"
import { ErrorBoundary } from "react-error-boundary"
import { QueryClient, QueryClientProvider } from "react-query"
import "styles/index.css"

interface AppProps extends NextAppProps {
  Component: NextComponentType & {
    getLayout?: (component: JSX.Element) => JSX.Element
  }
}

if (process.env.NODE_ENV === "production") {
  LogRocket.init("pztxki/zeltlager-website")
}

const client = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <QueryClientProvider client={client}>
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

const FallbackComponent = () => <ErrorComponent statusCode={400} />
