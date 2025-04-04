type InputProps = {
  type?: string
  placeholder?: string
  className?: string
  value?: string
  onChange?: (e: any) => void
}

export default function Input({ 
  type = 'text', 
  placeholder = '', 
  className = '', 
  value = '',
  onChange
}: InputProps) {
  return (
    <input 
      type={type} 
      className={`form-input ${className}`} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}
