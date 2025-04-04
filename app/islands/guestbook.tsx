import { useState } from 'hono/jsx'
import Tab from '../components/molecules/Tab'
import GuestbookForm from './GuestbookForm'
import GuestbookList from '../components/organisms/GuestbookList'
import { Context, Env } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { GuestBooks } from '../database/schema'

type GuestbookProps = {
  c: Context<Env, any, {}>
  className?: string
}

export default async function Guestbook({ c, className = '' }: GuestbookProps) {
  const [activeTab, setActiveTab] = useState(0)

  // タブをクリックしたときの処理
  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  // フォームの送信処理
  const handleSubmit = async (name: string, message: string) => {
    const db = drizzle(c.env.DB);
    await db.insert(GuestBooks).values({
      username: name,
      body: message,
    });
    alert('掲示板に書き込みました！ありがとうございます。')
  }

  return (
    <div className={`guestbook ${className}`}>
      <div className="guestbook-header">
        <span className="guestbook-icon">📝</span>
        掲示板
        <span className="guestbook-icon">📝</span>
      </div>
      
      <div className="guestbook-tabs">
        <Tab 
          label="カキコする"
          isActive={activeTab === 0}
          onClick={() => handleTabClick(0)}
        />
        <Tab 
          label="メッセージを読む"
          isActive={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
      </div>
      
      <div className="guestbook-content">
        {activeTab === 0 ? (
          <GuestbookForm onSubmit={handleSubmit} />
        ) : (
          <GuestbookList c={c} />
        )}
      </div>
    </div>
  )
}
