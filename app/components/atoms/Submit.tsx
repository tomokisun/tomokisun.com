import { JSX } from 'hono/jsx/jsx-runtime';

type SubmitProps = {
  children: JSX.Element | string;
  className?: string
}

export default function Submit({ children, className }: SubmitProps) {
  return (
    <button
      type='submit'
      className={`submit-button ${className}`} 
    >
      <span className="submit-button-text">{children}</span>
    </button>
  )
}
