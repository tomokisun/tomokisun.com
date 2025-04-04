import { GuestbookEntity } from '../../types/guest-books'
import GuestbookEntry from '../molecules/GuestbookEntry'

type GuestbookListProps = {
  entities: GuestbookEntity[]
  className?: string
}

export default function GuestbookList({
  entities,
  className = ''
}: GuestbookListProps) {
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
