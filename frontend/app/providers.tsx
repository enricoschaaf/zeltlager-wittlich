"use client"

import LogRocket from "logrocket"
import { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import ErrorComponent from "components/Error"
import { ErrorBoundary } from "react-error-boundary"

if (process.env.NODE_ENV === "production") {
  LogRocket.init("pztxki/zeltlager-website")
}

const FallbackComponent = () => <ErrorComponent statusCode={400} />

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ErrorBoundary>
  )
}
