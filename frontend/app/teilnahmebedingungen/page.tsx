import { config } from "project.config"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Teilnahmebedingungen"),
}

const ParticipationTermsConditions = () => (
  <div className="prose m-auto">
    <h1>Teilnahmebedingungen</h1>
    <h2>Stornierung</h2>
    <p>
      Viele Kosten entstehen leider schon lange vor Beginn der{" "}
      {config.shortName}. Bei Absagen, die weniger als einen Monat vor der{" "}
      {config.shortName} erfolgen, können wir deshalb nur 50% des
      Teilnehmendenbeitrags zurückerstatten. Erfolgt die Absage weniger als eine
      Wochen vor der {config.shortName}, behalten wir uns vor, den
      Teilnehmendenbeitrag in voller Höhe einzubehalten.
    </p>
  </div>
)

export default ParticipationTermsConditions
