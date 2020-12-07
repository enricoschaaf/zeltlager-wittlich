import { Title } from "components/Title"
import { Layout } from "layouts/Layout"
import { NextPage } from "next"
import Link from "next/link"

const Index = () => {
  return (
    <>
      <Title />
      <div className="max-w-4xl z-10 grid gap-y-4 sm:gap-y-6 justify-center items-center">
        <span className="w-full inline-flex rounded-md shadow-sm">
          <Link href="/anmelden">
            <a className="w-full inline-flex justify-center items-center px-8 py-4 border border-transparent text-xl leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition ease-in-out duration-150">
              Anmelden
            </a>
          </Link>
        </span>
        <br></br>
        <div className="prose sm:prose-lg">
          <div className="flex justify-between">
            <b>Saaarhölzbach</b>
            <b>08.08.21 - 18.08.21</b>
          </div>
          <p style={{ textAlign: "justify" }}>
            In der Zeit von Sonntag, 08.08.2021 bis Mittwoch, 18.08.2021 weht
            das Löwenbanner dieses Mal auf dem Jugendzeltplatz Saaarhölzbach.
            Wenn ihr zur Zeit des Zeltlagers zwischen 9 und 15 Jahre alt seid
            und jede Menge Spaß und Gemeinschaft unter freiem Himmel erleben
            möchtet, dann seid ihr hier richtig. Meldet euch so bald wie möglich
            an!
          </p>
        </div>
      </div>
    </>
  )
}

Index.getLayout = (page: NextPage) => (
  <Layout title="Fotos">
    <main className="h-full px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      {page}
    </main>
  </Layout>
)

export default Index
