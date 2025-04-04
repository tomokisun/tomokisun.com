import { Context, Env } from 'hono'
import GuestbookEntry from '../molecules/GuestbookEntry'
import { drizzle } from 'drizzle-orm/d1'
import { GuestBooks } from '../../database/schema'

type GuestbookEntry = {
  name: string
  date: string
  content: string
}

type GuestbookListProps = {
  c: Context<Env, any, {}>
  className?: string
}

export default async function GuestbookList({ 
  c,
  className = ''
}: GuestbookListProps) {
  const db = drizzle(c.env.DB);
  const guestBooks = await db.select().from(GuestBooks).all();
  const entries: GuestbookEntry[] = guestBooks.map((g) => {
    const date = new Date(g.createdAt);
    return {
      name: g.username,
      date: date.toString(),
      content: g.body,
    };
  });

  return (
    <div className={`guestbook-entries ${className}`}>
      {entries.map((entry, index) => (
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
