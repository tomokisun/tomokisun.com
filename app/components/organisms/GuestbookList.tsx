import GuestbookEntry from '../molecules/GuestbookEntry'

type GuestbookEntry = {
  name: string
  date: string
  content: string
}

type GuestbookListProps = {
  entries?: GuestbookEntry[]
  className?: string
}

// デフォルトのエントリー
const defaultEntries = [
  {
    name: '田中太郎',
    date: '2025年4月3日',
    content: '素晴らしいウェブサイトですね！90年代のデザインが懐かしいです。'
  },
  {
    name: '佐藤花子',
    date: '2025年4月2日',
    content: '初めまして！あなたの経歴に興味があります。またお話しましょう。'
  },
  {
    name: '鈴木一郎',
    date: '2025年4月1日',
    content: 'このサイトのデザインが素敵です！昔のインターネットを思い出します。'
  }
]

export default function GuestbookList({ 
  entries = defaultEntries,
  className = ''
}: GuestbookListProps) {
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
