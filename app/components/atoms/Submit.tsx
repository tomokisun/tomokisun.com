import { JSX } from 'hono/jsx/jsx-runtime';

type SubmitProps = {
  children: JSX.Element;
  className?: string
}

export default function Submit({ children, className }: SubmitProps) {
  return (
    <input
      type='submit'
      className={`submit-button ${className}`} 
    >
      <span className="submit-button-text">{children}</span>
    </input>
  )
}