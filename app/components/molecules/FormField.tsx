import Input from '../atoms/Input'
import TextArea from '../atoms/TextArea'

type FormFieldProps = {
  label: string
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
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={inputClassName}
          />
        ) : (
          <Input 
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
