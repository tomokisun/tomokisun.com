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
    <div className={`section ${className}`}>
      {id && <a name={id}></a>}
      <div className="section-header">
        {title}
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  )
}
