import { Layout } from "layouts/Layout"

export default ({ children }: { children: React.ReactNode }) => (
  <Layout>
    <main className="h-full max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</main>
  </Layout>
)
