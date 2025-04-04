import { createElement } from 'hono/jsx'

type HeaderProps = {
  title: string
  showUnderConstruction?: boolean
  className?: string
}

export default function Header({ 
  title, 
  showUnderConstruction = true,
  className = ''
}: HeaderProps) {
  return (
    <td colSpan={2} align="center" bgcolor="#000000" className={className}>
      <h1 className="blink">{title}</h1>
      {showUnderConstruction && (
        <div className="under-construction">
          <span>常に工事中</span>
        </div>
      )}
    </td>
  )
}
