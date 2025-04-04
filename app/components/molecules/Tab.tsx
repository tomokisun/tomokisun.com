type TabProps = {
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export default function Tab({ 
  label, 
  isActive, 
  onClick,
  className = ''
}: TabProps) {
  return (
    <div 
      className={`guestbook-tab ${isActive ? 'guestbook-tab-active' : ''} ${className}`}
      onClick={onClick}
    >
      {label}
    </div>
  )
}
