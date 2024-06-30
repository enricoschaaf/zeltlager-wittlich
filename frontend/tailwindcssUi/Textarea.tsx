"use client"

import { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef } from "react"

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ name, label, description, className, ...props }: TextareaProps, ref) => (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-5 text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1 rounded-md shadow-sm">
        <textarea
          ref={ref}
          id={name}
          name={name}
          className="block w-full rounded-md border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 resize-none"
          {...props}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  ),
)

interface TextareaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
  description: string
}
