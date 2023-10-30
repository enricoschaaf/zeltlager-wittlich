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
      {/* <div className="w-full p-4 bg-primary-700 text-white text-center font-medium font-xl">
        Das Zeltlager 2023 ist ausgebucht. 2024 geht es vom 04.08. - 14.08. nach
        Wershofen.
      </div> */}
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </>
  )
}
