import { JSX } from 'hono/jsx/jsx-runtime'

type ButtonProps = {
  onClick?: () => void
  children: JSX.Element;
  className?: string
}

export default function Button({ onClick, children, className = '' }: ButtonProps) {
  return (
    <button 
      type="button" 
      className={`submit-button ${className}`} 
      onClick={onClick}
    >
      <span className="submit-button-text">{children}</span>
    </button>
  )
}
