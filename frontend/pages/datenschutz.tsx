import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const Privacy = () => null

Privacy.getLayout = (page: NextPage) => (
  <Layout title="Datenschutz">
    <main className="h-full">{page}</main>
  </Layout>
)

export default Privacy
