"use client"

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
      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary active:bg-primary-700 transition ease-in-out duration-150"
      {...props}
    >
      {children}
    </button>
  </span>
)
