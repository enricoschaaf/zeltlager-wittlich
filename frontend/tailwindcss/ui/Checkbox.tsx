import { DetailedHTMLProps, InputHTMLAttributes } from "react"

export const Checkbox = ({
  name,
  label,
  description,
  className,
  register,
  ...props
}: CheckboxProps) => (
  <div className={"flex items-start " + className}>
    <div className="flex items-center h-5">
      <input
        id={name}
        name={name}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        ref={register}
        {...props}
      />
    </div>
    <div className="ml-3 text-sm leading-5">
      <label htmlFor={name} className="font-medium text-gray-700">
        {label}
      </label>
      {description && <p className="text-gray-500">{description}</p>}
    </div>
  </div>
)

interface CheckboxProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
  description?: string
  register: any
}
