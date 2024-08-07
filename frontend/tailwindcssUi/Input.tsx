"use client"

import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react"

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { name, className, label, errors, description, ...props }: InputProps,
    ref,
  ) => {
    return (
      <div className={className}>
        <label
          htmlFor={name}
          className={
            typeof label === "object" && label.visibility === "hidden"
              ? "sr-only"
              : "block text-sm font-medium text-warm-gray-900"
          }
        >
          {typeof label === "string" ? label : label.value}
        </label>
        <div className="mt-1">
          <input
            ref={ref}
            type="text"
            id={name}
            name={name}
            className={`block w-full rounded-md border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500${
              errors[name]
                ? " pr-10 border-red-300 placeholder-red-300 text-red-900 focus:border-red-300 focus:shadow-outline-red focus:ring-red-500"
                : ""
            }`}
            aria-invalid="true"
            aria-describedby={`${name}-error`}
            {...props}
          />
          {errors[name] && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {description && (
          <p className="mt-2 text-sm text-gray-500" id="email-description">
            {description}
          </p>
        )}
        {errors[name] && (
          <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
            {errors[name].message}
          </p>
        )}
      </div>
    )
  },
)

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  name: string
  label: string | { value: string; visibility: "visible" | "hidden" }
  description?: string
  errors: any
}
