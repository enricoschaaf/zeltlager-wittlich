import { DetailedHTMLProps, InputHTMLAttributes } from "react"

interface CheckboxAttributes
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
  description: string
  register: any
}

export const Checkbox = ({
  name,
  label,
  description,
  className,
  register,
  ...props
}: CheckboxAttributes) => (
  <div className={"relative flex items-start " + className}>
    <div className="flex items-center h-5">
      <input
        id={name}
        name={name}
        type="checkbox"
        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        ref={register}
        {...props}
      />
    </div>
    <div className="ml-3 text-sm leading-5">
      <label htmlFor={name} className="font-medium text-gray-700">
        {label}
      </label>
      <p className="text-gray-500">{description}</p>
    </div>
  </div>
)
