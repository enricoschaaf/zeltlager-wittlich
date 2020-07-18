import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

export const Button = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => (
  <span className={"w-full inline-flex rounded-md shadow-sm " + className}>
    <button
      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
      {...props}
    >
      {children}
    </button>
  </span>
)
