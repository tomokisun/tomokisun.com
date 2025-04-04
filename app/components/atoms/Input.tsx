type InputProps = {
  name: string
  type?: string
  placeholder?: string
  className?: string
  value?: string
  onChange?: (e: any) => void
}

export default function Input({ 
  name,
  type = 'text', 
  placeholder = '', 
  className = '', 
  value = '',
  onChange
}: InputProps) {
  return (
    <input 
      type={type} 
      name={name}
      className={`form-input ${className}`} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}
