import Error from "components/Error"
import { Layout } from "layouts/Layout"

const Custom404 = () => <Error statusCode={404} />

Custom404.getLayout = page => (
  <Layout>
    <main className="h-full">{page}</main>
  </Layout>
)

export default Custom404
