import Registrations from "components/Registrations"
import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const Anmeldungen = () => <Registrations />

Anmeldungen.getLayout = (page: NextPage) => (
  <Layout title="Anmeldungen">
    <main className="h-full">{page}</main>
  </Layout>
)

export default Anmeldungen
