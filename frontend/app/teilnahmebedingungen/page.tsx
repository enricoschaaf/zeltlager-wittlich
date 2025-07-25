import { config } from "project.config"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Teilnahmebedingungen"),
}

const ParticipationTermsConditions = () => (
  <div className="prose m-auto px-4">
    <h1 className="break-words">Teilnahmebedingungen</h1>
    <h2>Stornierung</h2>
    <p>
      Viele Kosten entstehen leider schon lange vor Beginn der{" "}
      {config.shortName}. Bei Absagen, die weniger als einen Monat vor der{" "}
      {config.shortName} erfolgen, können wir deshalb nur 50% des
      Teilnehmendenbeitrags zurückerstatten. Erfolgt die Absage weniger als eine
      Wochen vor der {config.shortName}, behalten wir uns vor, den
      Teilnehmendenbeitrag in voller Höhe einzubehalten.
    </p>
    <h2>Lagerordnung</h2>
    <ul>
      <li>
        Den Anweisungen der Lagerleitung und den Betreuerenden ist unbedingt
        Folge zu leisten.
      </li>
      <li>
        Von 23.00 Uhr bis 8.00 Uhr herrscht Lagerruhe. Alle Lagerteilnehmenden,
        die keine Nachtwache haben, müssen sich in ihren Zelten aufhalten.
      </li>
      <li>Ohne Erlaubnis darf der Zeltplatz nicht verlassen werden.</li>
      <li>
        Mit den Zelten und der Lagereinrichtung des Zeltlagers so wie den
        Einrichtungen des Zeltplatzes ist sorgsam umzugehen.
      </li>
      <li>
        In den Zelten ist jegliche Art von Feuer und Sprühen von Kosmetika, wie
        Deo oder Insektenspray, verboten.
      </li>
      <li>
        Die Teilnehmenden tragen tatkräftig zum Lagerleben bei (z.B. Holz holen,
        Küchen - , Toiletten - oder Lagerfeuerdienst etc.).
      </li>
      <li>
        Nur denen, die Küchendienst haben, ist es gestattet, sich im Bereich der
        Küche aufzuhalten.
      </li>
      <li>Alle Mahlzeiten werden gemeinsam eingenommen.</li>
      <li>Rauchen und Alkohol sind verboten.</li>
      <li>
        Unterhaltungselektronik wie Handys oder Spielekonsolen, Gaskocher und-
        lampen sowie Messer mit feststehender oder feststellbarer Klinge dürfen
        nicht mitgebracht werden
      </li>
      <li>
        Kinder werden wenn nötig in Privatautos von Betreuenden transportiert.
      </li>
      <li>
        Sollte die Veranstaltung aus Gründen abgesagt werden müssen, erfolgt
        keine Betreuung der Kinder und es besteht kein Anspruch auf
        Schadensersatz.
      </li>
    </ul>
  </div>
)

export default ParticipationTermsConditions
