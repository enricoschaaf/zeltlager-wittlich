import { DetailedHTMLProps, InputHTMLAttributes } from "react"

interface InputAttributes
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
  register: any
}

export const Input = ({
  name,
  register,
  className,
  label,
  ...props
}: InputAttributes) => (
  <div className={className}>
    <label
      htmlFor={name}
      className="block text-sm font-medium leading-5 text-gray-700"
    >
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        name={name}
        className="form-input py-3 px-4 block w-full transition ease-in-out duration-150"
        ref={register}
        {...props}
      />
    </div>
  </div>
)
