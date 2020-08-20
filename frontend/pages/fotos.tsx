import { PhotoGallery } from "components/PhotoGallery"
import { useAuth } from "hooks/useAuth"
import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const Photos = () => {
  useAuth()
  return <PhotoGallery />
}

Photos.getLayout = (page: NextPage) => (
  <Layout title="Fotos">
    <main className="h-full">{page}</main>
  </Layout>
)

export default Photos
