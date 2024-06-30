import { PhotoGallery } from "components/PhotoGallery"
import { formatTitle } from "utils/formatTitle"

export const metadata = {
  title: formatTitle("Fotos"),
}

const Photos = () => {
  return <PhotoGallery />
}

export default Photos
