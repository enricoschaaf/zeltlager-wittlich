import Registrations from "components/Registrations"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Anmeldungen"),
}

const Anmeldungen = () => {
  return <Registrations />
}

export default Anmeldungen
