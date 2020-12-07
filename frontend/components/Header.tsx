import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { Logo } from "./Logo"

export const Header = () => {
  const [status, setStatus] = useState<"open" | "closed">("closed")
  const { events } = useRouter()
  events?.on("routeChangeStart", () => setStatus("closed"))
  return (
    <header className="flex justify-between items-center px-4 py-6 sm:px-6">
      <Link href="/">
        <a>
          <Logo className="h-8 w-auto sm:h-10" />
        </a>
      </Link>
      <div className="-mr-2 -my-2 md:hidden">
        <button
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
          onClick={() => setStatus("open")}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Navigation öffnen</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <nav className="hidden md:flex space-x-10 flex-grow justify-center">
        <Link href="/blog">
          <a className="text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150">
            Blog
          </a>
        </Link>
        <Link href="/fotos">
          <a className="text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150">
            Fotos
          </a>
        </Link>{" "}
        <Link href="/anmelden">
          <a className="text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150">
            Online Anmeldung
          </a>
        </Link>
        <a
          href="/2021_Ausschreibung_Saarhölzbach.pdf"
          download="2021_Ausschreibung_Saarhölzbach.pdf"
          className="text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
        >
          Ausschreibung herunterladen
        </a>
      </nav>
      <AnimatePresence>
        {status === "open" && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              transition: { duration: 0.15, ease: "easeOut" },
              opacity: 1,
              scale: 1,
            }}
            exit={{
              transition: { duration: 0.1, ease: "easeIn" },
              opacity: 0,
              scale: 0.95,
            }}
            className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50"
          >
            <div className="rounded-lg shadow-md">
              <div
                className="rounded-lg bg-white shadow-xs overflow-hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="main-menu"
              >
                <div className="px-5 pt-4 flex items-center justify-between">
                  <Logo className="h-8 w-auto" />
                  <div className="-mr-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                      aria-label="Close menu"
                      onClick={() => setStatus("closed")}
                    >
                      <svg
                        className="h-6 w-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="px-2 pt-2 pb-3">
                  <Link href="/blog">
                    <a
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                      role="menuitem"
                    >
                      Blog
                    </a>
                  </Link>
                  <Link href="/fotos">
                    <a
                      className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                      role="menuitem"
                    >
                      Fotos
                    </a>
                  </Link>
                  <a
                    href="/2021_Ausschreibung_Saarhölzbach.pdf"
                    download="2021_Ausschreibung_Saarhölzbach.pdf"
                    className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                    role="menuitem"
                  >
                    Ausschreibung herunterladen
                  </a>
                </div>
                <Link href="/anmelden">
                  <a
                    className="block w-full px-5 py-3 text-center font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700 transition duration-150 ease-in-out"
                    role="menuitem"
                  >
                    Online Anmeldung
                  </a>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
