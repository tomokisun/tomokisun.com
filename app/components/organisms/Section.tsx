import type { JSX } from 'hono/jsx/jsx-runtime'

type SectionProps = {
  id?: string
  title: string | JSX.Element
  children: JSX.Element | JSX.Element[]
  className?: string
}

export default function Section({ id, title, children, className = '' }: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={headingId}>
      <h2 id={headingId} className="section-header">
        {title}
      </h2>
      <div className="section-content">{children}</div>
    </section>
  )
}
