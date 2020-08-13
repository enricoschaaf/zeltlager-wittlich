import { motion } from "framer-motion"

export const Modal = ({
  status,
  headline,
  description,
  buttonOnClick,
  buttonText,
}: ModalProps) => {
  return (
    <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
      <div className="fixed inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            transition: { duration: 0.3, ease: "easeOut" },
            opacity: 0.75,
          }}
          exit={{
            transition: { duration: 0.2, ease: "easeIn" },
            opacity: 0,
          }}
          className="absolute inset-0 bg-gray-500"
        />
      </div>
      <motion.div
        initial={{
          y: matchMedia("min-width: 640px") ? 0 : "1rem",
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          transition: { duration: 0.3, ease: "easeOut" },
          opacity: 1,
          scale: 1.000001,
          y: 0,
        }}
        exit={{
          transition: { duration: 0.2, ease: "easeIn" },
          opacity: 0,
          scale: 0.95,
          y: matchMedia("min-width: 640px") ? 0 : "1rem",
        }}
        className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl sm:max-w-sm sm:w-full sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div>
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
              status === "success" ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <svg
              className={`h-6 w-6 ${
                status === "success"
                  ? "text-green-600 check"
                  : "text-yellow-600 exclamation-circle"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {status === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3
              className="text-lg leading-6 font-medium text-gray-900"
              id="modal-headline"
            >
              {headline}
            </h3>
            <div className="mt-2">
              <p className="text-sm leading-5 text-gray-500">{description}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <span className="flex w-fullddd rounded-md shadow-sm">
            <button
              onClick={() => buttonOnClick()}
              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            >
              {buttonText}
            </button>
          </span>
        </div>
      </motion.div>
    </div>
  )
}

interface ModalProps {
  status: "success" | "warn"
  headline: string
  description: string
  buttonOnClick: () => void
  buttonText: string
}
