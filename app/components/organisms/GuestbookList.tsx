import { GuestbookEntity } from '../../types/guest-books'
import GuestbookEntry from '../molecules/GuestbookEntry'

type GuestbookListProps = {
  className?: string
}

export default function GuestbookList({
  className = ''
}: GuestbookListProps) {
  const entities: GuestbookEntity[] = []
  return (
    <div className={`guestbook-entries ${className}`}>
      {entities.map((entry, index) => (
        <GuestbookEntry 
          key={index}
          name={entry.name}
          date={entry.date}
          content={entry.content}
        />
      ))}
    </div>
  )
}
