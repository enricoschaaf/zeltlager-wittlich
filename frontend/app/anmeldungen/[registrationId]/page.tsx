import { getRegistration } from "actions/getRegistration"
import { UpdateForm } from "components/UpdateForm"
import { useAuth } from "hooks/useAuth"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Anmeldung anpassen"),
}

const EditRegistration = async ({
  params,
}: {
  params: { registrationId: string }
}) => {
  return <UpdateForm registrationId={params.registrationId} />
}

export default EditRegistration
