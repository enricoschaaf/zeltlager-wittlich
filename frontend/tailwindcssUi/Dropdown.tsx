"use client"

import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react"

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ name, label, className, ...props }: DropdownProps, ref) => (
    <div className={className}>
      <label
        htmlFor={name}
        className={
          typeof label === "object" && label.visibility === "hidden"
            ? "sr-only"
            : "block text-sm font-medium leading-5 text-gray-700"
        }
      >
        {typeof label === "string" ? label : label.value}
      </label>
      <select
        id={name}
        ref={ref}
        name={name}
        className="mt-1 block w-full rounded-md border-gray-300 py-3.5 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        defaultValue="-"
        {...props}
      >
        <option>W</option>
        <option>M</option>
        <option>D</option>
      </select>
    </div>
  ),
)

interface DropdownProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label: string | { value: string; visibility: "visible" | "hidden" }
}
