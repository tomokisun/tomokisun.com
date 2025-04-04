import { useState } from 'hono/jsx'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'

type GuestbookFormProps = {
  onSubmit?: (name: string, message: string) => void
  className?: string
}

export default function GuestbookForm({ onSubmit, className = '' }: GuestbookFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    // 簡易バリデーション
    if (!name.trim()) {
      alert('お名前を入力してください。')
      return
    }
    
    if (!message.trim()) {
      alert('メッセージを入力してください。')
      return
    }
    
    if (onSubmit) {
      onSubmit(name, message)
    } else {
      // 実際のアプリケーションでは、ここでサーバーにデータを送信する処理を追加
      // この例では、送信成功のアラートを表示するだけ
      alert('ゲストブックに署名しました！ありがとうございます。')
    }
    
    // フォームをリセット
    setName('')
    setMessage('')
  }

  return (
    <div className={`guestbook-form ${className}`}>
      <form>
        <table className="guestbook-form-table">
          <FormField 
            label="お名前:"
            placeholder="あなたのお名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormField 
            label="メッセージ:"
            type="textarea"
            placeholder="ここにメッセージを入力してください"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </table>
        <div className="guestbook-submit-container">
          <Button onClick={handleSubmit}><span>送信する</span></Button>
        </div>
      </form>
    </div>
  )
}
