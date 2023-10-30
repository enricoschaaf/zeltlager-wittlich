import { Layout } from "layouts/Layout"

export default ({ children }: { children: React.ReactNode }) => (
  <Layout>
    <main className="h-full">{children}</main>
  </Layout>
)
