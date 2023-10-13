import { Title } from "components/Title"
import { Layout } from "layouts/Layout"
import { NextPage } from "next"
import Link from "next/link"

const Index = () => {
  return (
    <>
      <Title />
      <div className="z-10 grid items-center justify-center max-w-4xl gap-y-4 sm:gap-y-6">
        <span className="inline-flex w-full rounded-md shadow-sm">
          <Link
            href="/anmelden"
            className="inline-flex items-center justify-center w-full px-8 py-4 text-xl font-medium leading-6 text-white transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-primary active:bg-gray-700"
          >
            Anmelden
          </Link>
        </span>
        <br></br>
        <div className="prose sm:prose-lg">
          <h1>Zeltlager der Löwen</h1>
          <div className="flex justify-between">
            <b>Wershofen</b>
            <b>04.08. - 14.08.2024</b>
          </div>
          <p style={{ textAlign: "justify" }}>
            In der Zeit von Sonntag, 04.08., bis Mittwoch, 14.08.2024, weht das
            Löwenbanner dieses Mal auf dem Jugendzeltplatz Wershofen. Wenn ihr
            zur Zeit des Zeltlagers zwischen 9 und 15 Jahre alt seid und jede
            Menge Spaß und Gemeinschaft unter freiem Himmel erleben möchtet,
            dann seid ihr hier richtig. Meldet euch so bald wie möglich an!
            <br />
            <br />
            Der Teilnehmendenbeitrag beträgt zwischen 180€ und 220€. Familien
            zeigen sich mit Familien solidarisch, deshalb bezahlen Sie, was Sie
            geben können. Werden mehrere Kinder einer Familie angemeldet, so
            wird ab dem zweiten Kind ein reduzierter Beitrag zwischen 140€ und
            180€ erhoben. KjG - Mitglieder zahlen 11€ weniger. Enthalten sind
            sämtliche anfallenden Kosten für Anreise, Unterbringung,
            Vollverpflegung, Eintritte, Fahrkarten etc. Die Unterbringung
            erfolgt in zeltlagereigenen Gruppenzelten.
            <br />
            <br />
            Wir sind sehr dankbar für die zusätzliche Unterstützung, falls
            Eltern den Teilnehmendenbeitrag mit einem freiwilligen solidarischen
            Zusatzbeitrag aufstocken möchten. Bei finanziellen Schwierigkeiten
            kann unsere Gemeindereferentin Heike Feldges angesprochen werden,
            die Anfrage wird vertraulich behandelt.
            <br />
            <br />
            Ihre Ansprechpartner für das Zeltlager sind Enrico Schaaf und Niklas
            Sips. Weitere Informationen und Antworten auf Rückfragen gibt es per
            E-Mail unter{" "}
            <a
              href="mailto:mail@zeltlager-wittlich.de"
              rel="noreferrer"
              target="_blank"
            >
              mail@zeltlager-wittlich.de
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

Index.getLayout = (page: NextPage) => (
  <Layout title="Fotos">
    <main className="flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
      {page}
    </main>
  </Layout>
)

export default Index
