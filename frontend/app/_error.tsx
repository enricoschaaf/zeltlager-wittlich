import Error from "components/Error"
import { GetServerSideProps } from "next"
import { formatTitle } from "utils/formatTitle"



export const metadata = {
  title: formatTitle("Unerwarteter Fehler aufgetreten"),
}


const CustomError = (statusCode: number) => <main className="h-full"><Error statusCode={statusCode} /></main>

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const statusCode = res ? res.statusCode : 404
  return { props: { statusCode } }
}

export default CustomError
