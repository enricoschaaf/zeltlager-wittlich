import Error from "components/Error"
import { Layout } from "layouts/Layout"
import { GetServerSideProps, NextPage } from "next"

const CustomError = (statusCode: number) => <Error statusCode={statusCode} />

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context)
  const { res } = context
  const statusCode = res ? res.statusCode : 404
  return { props: { statusCode } }
}

CustomError.getLayout = (page: NextPage) => (
  <Layout>
    <main className="h-full">{page}</main>
  </Layout>
)

export default CustomError
