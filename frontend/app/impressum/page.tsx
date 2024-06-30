import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Impressum"),
}

const LegalNotice = () => (
  <div className="prose m-auto px-4">
    <h1>Impressum</h1>
    <h2>Inhaltlich Verantwortlich</h2>
    <p>
      Pfarrei Im Wittlicher Tal St. Anna
      <br />
      Vertreten durch: Dekan Matthias Veit, Michael Aurich
      <br />
      Karrstraße 14
      <br />
      54516 Wittlich
    </p>
    <a href="tel:+4965716368">Tel.: 06571 6368</a>
    <br />
    <a
      href="mailto:mail@zeltlager-wittlich.de"
      rel="noreferrer"
      target="_blank"
    >
      mail@zeltlager-wittlich.de
    </a>
    <h2>Zuständige Aufsichtsbehörde</h2>
    <p>Bistum Trier</p>
    <h2>Informationen zur Online-Streitbeilegung</h2>
    <p>
      Die Europäische Kommission stellt eine Plattform zur
      Online-Streitbeilegung (OS) bereit. Diese Plattform finden Sie unter
      folgendem Link: <a>https://ec.europa.eu/consumers/odr</a>. Verbraucher
      können diese Plattform nutzen, um ihre Streitigkeiten aus Online-Verträgen
      beizulegen.
    </p>
    <h2>Urheberrecht und Bildnachweise</h2>
    <p>
      Die Inhalte von zeltlager-wittlich.de sind - soweit nicht abweichend
      angegeben - urheberrechtlich geschützt. Verwendete Fotografien sind ggf.
      mit Bildnachweisen gekennzeichnet oder unten aufgeführt, soweit sie nicht
      selbst angefertigt wurden. Die Verwendung von Fotografien auf Drittseiten
      ist nur im Rahmen der jeweiligen Lizenz der Urheber möglich.
    </p>
  </div>
)

export default LegalNotice
