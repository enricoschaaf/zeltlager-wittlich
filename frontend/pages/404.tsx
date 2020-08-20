import Error from "components/Error"
import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const Custom404 = () => <Error statusCode={404} />

Custom404.getLayout = (page: NextPage) => (
  <Layout>
    <main className="h-full">{page}</main>
  </Layout>
)

export default Custom404
