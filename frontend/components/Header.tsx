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
    <header className="flex items-center justify-between px-4 py-6 sm:px-6">
      <Link href="/">
        <Logo className="w-auto h-8 sm:h-10" />
      </Link>
      <div className="-my-2 -mr-2 md:hidden">
        <button
          className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
          onClick={() => setStatus("open")}
        >
          <svg
            className="w-6 h-6"
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
      <nav className="justify-center flex-grow hidden space-x-10 md:flex">
        {/* <Link
          href="/blog"
          className="text-base font-medium leading-6 text-gray-500 transition duration-150 ease-in-out hover:text-gray-900 focus:outline-none focus:text-gray-900"
        >
          Blog
        </Link>
        <Link
          href="/fotos"
          className="text-base font-medium leading-6 text-gray-500 transition duration-150 ease-in-out hover:text-gray-900 focus:outline-none focus:text-gray-900"
        >
          Fotos
        </Link> */}
        <Link
          href="/anmelden"
          className="text-base font-medium leading-6 text-gray-500 transition duration-150 ease-in-out hover:text-gray-900 focus:outline-none focus:text-gray-900"
        >
          Anmeldung
        </Link>
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
            className="absolute inset-x-0 top-0 z-50 p-2 transition origin-top-right transform md:hidden"
          >
            <div className="rounded-lg shadow-md">
              <div
                className="overflow-hidden bg-white rounded-lg shadow-xs"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="main-menu"
              >
                <div className="flex items-center justify-between px-5 pt-4">
                  <Logo className="w-auto h-8" />
                  <div className="-mr-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                      aria-label="Close menu"
                      onClick={() => setStatus("closed")}
                    >
                      <svg
                        className="w-6 h-6"
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
                  <Link
                    href="/blog"
                    className="block px-3 py-2 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                    role="menuitem"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/fotos"
                    className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                    role="menuitem"
                  >
                    Fotos
                  </Link>
                </div>
                <Link
                  href="/anmelden"
                  className="block w-full px-5 py-3 font-medium text-center text-gray-600 transition duration-150 ease-in-out bg-gray-50 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700"
                  role="menuitem"
                >
                  Anmeldung
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
