import { Layout } from "layouts/Layout"
import Error from "components/Error"

const CustomError = (statusCode: number) => <Error statusCode={statusCode} />

export async function getServerSideProps({ res, err }) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { props: { statusCode } }
}

CustomError.getLayout = page => (
  <Layout>
    <main className="h-full">{page}</main>
  </Layout>
)

export default CustomError
