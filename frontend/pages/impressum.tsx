import { Layout } from "layouts/Layout"

const LegalNotice = () => null

LegalNotice.getLayout = page => (
  <Layout title="Impressum">
    <main className="h-full">{page}</main>
  </Layout>
)

export default LegalNotice
