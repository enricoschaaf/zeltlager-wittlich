import { DetailedHTMLProps, InputHTMLAttributes } from "react"

export const Radio = ({
  id,
  label,
  className,
  register,
  ...props
}: RadioProps) => (
  <div className={"flex items-center " + className}>
    <input
      id={id}
      value={id}
      type="radio"
      className="form-radio h-4 w-4 text-emerald-600 transition duration-150 ease-in-out"
      ref={register}
      {...props}
    />
    <label htmlFor={id} className="ml-3">
      <span className="block text-sm leading-5 font-medium text-gray-700">
        {label}
      </span>
    </label>
  </div>
)

interface RadioProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
  register: any
}
