import { useState } from 'hono/jsx'
import Tab from '../components/molecules/Tab'
import GuestbookForm from './GuestbookForm'
import GuestbookList from '../components/organisms/GuestbookList'
import { GuestbookEntity } from '../types/guest-books'

type GuestbookProps = {
  entities: GuestbookEntity[]
  className?: string
}

export default async function Guestbook({ entities, className = '' }: GuestbookProps) {
  const [activeTab, setActiveTab] = useState(0)

  // タブをクリックしたときの処理
  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  // フォームの送信処理
  const handleSubmit = async (name: string, message: string) => {
    console.log('[Guestbook] handleSubmit', name, message);
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
          <GuestbookList entities={entities} />
        )}
      </div>
    </div>
  )
}
