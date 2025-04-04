import { GuestBookEntity } from '../../types/guest-books'
import GuestbookEntry from '../molecules/GuestbookEntry'

type GuestbookListProps = {
  guestBooks: GuestBookEntity[]
  className?: string
}

export default function GuestbookList({
  guestBooks,
  className = ''
}: GuestbookListProps) {
  return (
    <div className={`guestbook-entries ${className}`}>
      {guestBooks.map((entry, index) => (
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
