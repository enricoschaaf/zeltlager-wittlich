import { Layout } from "layouts/Layout"

export default ({ children }: { children: React.ReactNode }) => (
  <Layout>
    <main className="flex justify-center items-center h-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </main>
  </Layout>
)
