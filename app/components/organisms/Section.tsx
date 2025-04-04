type SectionProps = {
  id?: string
  title: string
  children: any
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
