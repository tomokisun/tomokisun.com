import Text from '../atoms/Text'

type GuestbookEntryProps = {
  name: string
  date: string
  content: string
  className?: string
}

export default function GuestbookEntry({ 
  name, 
  date, 
  content,
  className = ''
}: GuestbookEntryProps) {
  return (
    <div className={`guestbook-entry ${className}`}>
      <div className="guestbook-entry-header">
        <span className="guestbook-entry-name">{name}</span>
        <span className="guestbook-entry-date">{date}</span>
      </div>
      <div className="guestbook-entry-content">
        <Text as="div">{content}</Text>
      </div>
    </div>
  )
}
