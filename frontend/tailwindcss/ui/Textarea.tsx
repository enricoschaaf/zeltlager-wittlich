import { DetailedHTMLProps, TextareaHTMLAttributes } from "react"

export const Textarea = ({
  name,
  label,
  description,
  register,
  className,
  ...props
}: TextareaProps) => (
  <div className={className}>
    <label
      htmlFor={name}
      className="block text-sm font-medium leading-5 text-gray-700"
    >
      {label}
    </label>
    <div className="mt-1 rounded-md shadow-sm">
      <textarea
        id={name}
        name={name}
        className="block w-full rounded-md border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 resize-none"
        ref={register}
        {...props}
      />
    </div>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
  </div>
)

interface TextareaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
  description: string
  register: any
}
