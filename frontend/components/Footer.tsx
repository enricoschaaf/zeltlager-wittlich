import Link from "next/link"

export const Footer = () => {
  return (
    <footer>
      <nav className="py-12 sm:px-6 lg:px-8 grid grid-flow-col justify-center gap-x-5">
        <Link href="/datenschutz">
          <a className="block leading-6 text-gray-500 hover:text-gray-900">
            Datenschutz
          </a>
        </Link>
        <Link href="/impressum">
          <a className="block leading-6 text-gray-500 hover:text-gray-900">
            Impressum
          </a>
        </Link>
      </nav>
    </footer>
  )
}
