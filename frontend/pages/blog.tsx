import { Layout } from "layouts/Layout"

const Blog = () => null

Blog.getLayout = page => (
  <Layout title="Blog">
    <main className="h-full">{page}</main>
  </Layout>
)

export default Blog
