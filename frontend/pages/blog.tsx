import { Layout } from "layouts/Layout"
import { NextPage } from "next"

const Blog = () => null

Blog.getLayout = (page: NextPage) => (
  <Layout title="Blog">
    <main className="h-full">{page}</main>
  </Layout>
)

export default Blog
