import { DetailedHTMLProps, InputHTMLAttributes, ReactNode, forwardRef } from "react"

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ name, label, description, className, ...props }: CheckboxProps, ref) => (
    <div className={"flex items-start " + className}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={name}
          name={name}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
  ),
)

interface CheckboxProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: ReactNode
  description?: string
}