import { Layout } from "layouts/Layout"

const Privacy = () => null

Privacy.getLayout = page => (
  <Layout title="Datenschutz">
    <main className="h-full">{page}</main>
  </Layout>
)

export default Privacy
