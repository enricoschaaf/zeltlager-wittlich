import Link from "next/link"
import Image from "next/image"
import KjGLogo from "public/kjgLogo.png"
import PfarreiLogo from "public/pfarreiLogo.png"
import SparkasseLogo from "public/sparkasseLogo.png"

export const Footer = () => {
  return (
    <footer>
      <nav className="py-12 px-4 sm:px-6 lg:px-8 grid grid-flow-col justify-center gap-x-5 items-center">
        <Link
          href="/datenschutz"
          className="block leading-6 text-gray-500 hover:text-gray-900"
        >
          Datenschutz
        </Link>
        <Image
          src={PfarreiLogo}
          className="grayscale sm:max-h-12 max-h-8 w-auto"
          alt="Pfarrei Im Wittlicher Tal St. Anna Logo"
        />
        <Image
          src={KjGLogo}
          className="grayscale sm:max-h-12 max-h-8 w-auto"
          alt="KjG Logo"
        />
        <Image
          src={SparkasseLogo}
          className="grayscale sm:max-h-12 max-h-8 w-auto"
          alt="Sparkasse Logo"
        />
        <Link
          href="/impressum"
          className="block leading-6 text-gray-500 hover:text-gray-900"
        >
          Impressum
        </Link>
      </nav>
    </footer>
  )
}
