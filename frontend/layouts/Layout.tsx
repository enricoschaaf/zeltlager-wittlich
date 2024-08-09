import { Footer } from "components/Footer"
import { Header } from "components/Header"
import { ReactNode } from "react"

export const Layout = ({
  children,
}: {
  children: ReactNode
  title?: string
}) => {
  return (
    <>
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </>
  )
}
