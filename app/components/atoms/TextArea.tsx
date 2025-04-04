type TextAreaProps = {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (e: any) => void
}

export default function TextArea({ 
  placeholder = '', 
  className = '', 
  value = '',
  onChange
}: TextAreaProps) {
  return (
    <textarea 
      className={`form-input guestbook-textarea ${className}`} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    ></textarea>
  )
}
