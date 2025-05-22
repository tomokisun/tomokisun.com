import GuestbookForm from './GuestbookForm'
import GuestbookList from './GuestbookList'
import { GuestBookEntity } from '../../types/guest-books'

type GuestbookProps = {
  guestBooks: GuestBookEntity[]
  captchaQuestion: string
  sessionId: string
  className?: string
}

export default function Guestbook({ guestBooks, captchaQuestion, sessionId, className = '' }: GuestbookProps) {
  return (
    <div className={`guestbook ${className}`}>
      <div className="guestbook-header">
        <span className="guestbook-icon">📝</span>
        掲示板
        <span className="guestbook-icon">📝</span>
      </div>
      
      <div className="guestbook-content">
        <GuestbookList guestBooks={guestBooks} />
        <GuestbookForm captchaQuestion={captchaQuestion} sessionId={sessionId} />
      </div>
    </div>
  )
}
