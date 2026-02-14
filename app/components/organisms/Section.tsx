import { JSX } from 'hono/jsx/jsx-runtime'

type SectionProps = {
  id?: string
  title: string | JSX.Element
  children: JSX.Element | JSX.Element[]
  className?: string
}

export default function Section({ 
  id, 
  title, 
  children,
  className = ''
}: SectionProps) {
  return (
    <div id={id} className={`section ${className}`}>
      <div className="section-header">
        {title}
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  )
}
