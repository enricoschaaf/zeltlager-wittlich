import { DetailedHTMLProps, TextareaHTMLAttributes } from "react"

interface TextareaAttributes
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
  description: string
  register: any
}

export const Textarea = ({
  name,
  label,
  description,
  register,
  className,
  ...props
}: TextareaAttributes) => (
  <div className={className}>
    <label
      htmlFor={name}
      className="block text-sm font-medium leading-5 text-gray-700"
    >
      {label}
    </label>
    <div className="mt-1 rbounded-md shadow-sm">
      <textarea
        id={name}
        name={name}
        className="form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none"
        ref={register}
        {...props}
      />
    </div>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
  </div>
)
