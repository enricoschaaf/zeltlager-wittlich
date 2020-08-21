import { motion } from "framer-motion"
import { ReactNode } from "react"

export const Modal = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          className="fixed inset-0 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{
            transition: { duration: 0.3, ease: "easeOut" },
            opacity: 1,
          }}
          exit={{
            transition: { duration: 0.2, ease: "easeIn" },
            opacity: 0,
          }}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </motion.div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <motion.div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
