import Error from "components/Error"
import { Layout } from "layouts/Layout"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Seite nicht gefunden"),
}

const Custom404 = () => (
  <Layout>
    <main className="h-full"></main>
    <Error statusCode={404} />
  </Layout>
)

export default Custom404
