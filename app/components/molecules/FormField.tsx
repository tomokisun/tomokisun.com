import Input from '../atoms/Input'
import TextArea from '../atoms/TextArea'

type FormFieldProps = {
  label: string
  name: string
  type?: 'text' | 'textarea'
  placeholder?: string
  value?: string
  onChange?: (e: any) => void
  className?: string
  labelClassName?: string
  inputClassName?: string
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  className = '',
  labelClassName = '',
  inputClassName = ''
}: FormFieldProps) {
  return (
    <tr className={className}>
      <td className={`guestbook-label ${labelClassName}`}>{label}</td>
      <td>
        {type === 'textarea' ? (
          <TextArea 
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={inputClassName}
          />
        ) : (
          <Input 
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={inputClassName}
          />
        )}
      </td>
    </tr>
  )
}
