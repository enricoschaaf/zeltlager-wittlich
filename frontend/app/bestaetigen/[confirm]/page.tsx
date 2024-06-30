import { Confirm } from "components/Confirm"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Anmeldung bestätigen"),
}

const ConfirmPage = async ({ params }: { params: { confirm: string } }) => (
  <Confirm confirm={params.confirm} />
)

export default ConfirmPage
