"use client"

import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react"

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ id, label, className, ...props }: RadioProps, ref) => (
    <div className={"flex items-center " + className}>
      <input
        ref={ref}
        id={id}
        value={id}
        type="radio"
        className="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
        {...props}
      />
      <label htmlFor={id} className="ml-3">
        <span className="block text-sm leading-5 font-medium text-gray-700">
          {label}
        </span>
      </label>
    </div>
  ),
)

interface RadioProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
}
