import { PhotoGallery } from "components/PhotoGallery"
import { useAuth } from "hooks/useAuth"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Fotos"),
}

const Photos = () => {
  useAuth()
  return <PhotoGallery />
}


export default Photos
