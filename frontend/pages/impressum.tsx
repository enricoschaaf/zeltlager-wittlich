import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const LegalNotice = () => null

LegalNotice.getLayout = (page: NextPage) => (
  <Layout title="Impressum">
    <main className="h-full">{page}</main>
  </Layout>
)

export default LegalNotice
