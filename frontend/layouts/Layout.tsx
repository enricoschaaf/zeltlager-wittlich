import { Footer } from "components/Footer"
import { Header } from "components/Header"
import { Title } from "components/Title"

export const Layout = ({ children, title = undefined }) => {
  return (
    <>
      <Title>{title}</Title>
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </>
  )
}
