type TextAreaProps = {
  name: string
  placeholder?: string
  className?: string
  value?: string
  onChange?: (e: any) => void
}

export default function TextArea({ 
  name,
  placeholder = '', 
  className = '', 
  value = '',
  onChange
}: TextAreaProps) {
  return (
    <textarea 
      name={name}
      className={`form-input guestbook-textarea ${className}`} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    ></textarea>
  )
}
