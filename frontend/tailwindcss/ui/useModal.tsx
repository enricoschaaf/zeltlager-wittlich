import { AnimatePresence, motion } from "framer-motion"
import { Dispatch, SetStateAction, useState } from "react"

interface ModelComponentProps {
  modal: "open" | "closed"
  status: "success" | "warn"
  setModal: Dispatch<SetStateAction<"open" | "closed">>
  headline: string
  description: string
  buttonText: string
}

const ModalComponent = ({
  modal,
  status,
  setModal,
  headline,
  description,
  buttonText,
}: ModelComponentProps) => {
  if (modal === "open") {
    return (
      <AnimatePresence>
        <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
          <div className="fixed inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.75,
              }}
              exit={{
                opacity: 0,
              }}
              className="absolute inset-0 bg-gray-500"
            />
          </div>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: matchMedia("min-width: 640px") ? 0 : "1rem",
            }}
            animate={{
              opacity: 1,
              scale: 1.000001,
              y: 0,
            }}
            exit={{
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
                    status === "success" ? "text-green-600" : "text-yellow-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
                  <p className="text-sm leading-5 text-gray-500">
                    {description}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <span className="flex w-full rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setModal("closed")}
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  {buttonText}
                </button>
              </span>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    )
  }
  return null
}

export function useModal() {
  const [modal, setModal] = useState<"open" | "closed">("closed")
  const Modal = ({
    headline,
    description,
    buttonText,
    status,
  }: {
    headline: string
    description: string
    buttonText: string
    status: "success" | "warn"
  }) => (
    <ModalComponent
      status={status}
      headline={headline}
      description={description}
      buttonText={buttonText}
      modal={modal}
      setModal={setModal}
    />
  )

  return {
    Modal,
    setModal,
  }
}
