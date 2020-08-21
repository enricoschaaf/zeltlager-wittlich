import { DetailedHTMLProps, InputHTMLAttributes } from "react"

export const Input = ({
  name,
  register,
  className,
  label,
  errors,
  ...props
}: InputProps) => {
  return (
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
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          id={name}
          name={name}
          className={`form-input py-3 px-4 block w-full transition ease-in-out duration-150${
            errors[name]
              ? " pr-10 border-red-300 placeholder-red-300 text-red-900 focus:border-red-300 focus:shadow-outline-red"
              : ""
          }`}
          aria-invalid="true"
          aria-describedby={`${name}-error`}
          ref={register}
          {...props}
        />
        {errors[name] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-red-500"
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
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {errors[name].message}
        </p>
      )}
    </div>
  )
}

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  name: string
  label: string | { value: string; visibility: "visible" | "hidden" }
  register: any
  errors: any
}
