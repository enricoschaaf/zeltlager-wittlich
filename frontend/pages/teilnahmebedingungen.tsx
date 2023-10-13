import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const ConditionsOfParticipation = () => (
  <div className="prose m-auto">
    <h1>Teilnahmebedingungen</h1>
    <h2>Stornierung</h2>
    <p>
      Viele Kosten entstehen leider schon lange vor Beginn des Zeltlagers. Bei
      Absagen, die weniger als einen Monat vor dem Zeltlager erfolgen, können
      wir deshalb nur 50% des Teilnehmendenbeitrags zurückerstatten. Erfolgt die
      Absage weniger als zwei Wochen vor dem Zeltlager, behalten wir uns vor,
      den Teilnehmendenbeitrag in voller Höhe einzubehalten.
    </p>
  </div>
)

ConditionsOfParticipation.getLayout = (page: NextPage) => (
  <Layout title="Impressum">
    <main className="h-full">{page}</main>
  </Layout>
)

export default ConditionsOfParticipation
