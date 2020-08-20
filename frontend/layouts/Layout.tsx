import { Footer } from "components/Footer"
import { Header } from "components/Header"
import { Title } from "components/Title"
import { ReactNode } from "react"

export const Layout = ({
  children,
  title,
}: {
  children: ReactNode
  title?: string
}) => {
  return (
    <>
      <Title>{title}</Title>
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </>
  )
}
