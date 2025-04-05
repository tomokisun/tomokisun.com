import FormField from '../molecules/FormField'
import Submit from '../atoms/Submit'

type GuestbookFormProps = {
  className?: string
}

export default function GuestbookForm({ className = '' }: GuestbookFormProps) {
  return (
    <div className={`guestbook-form ${className}`}>
      <form method='post'>
        <table className="guestbook-form-table">
          <FormField 
            label="お名前:"
            name='username'
            placeholder="あなたのお名前"
          />
          <FormField 
            label="メッセージ:"
            name='body'
            type="textarea"
            placeholder="ここにメッセージを入力してください"
          />
        </table>
        <div className="guestbook-submit-container">
          <Submit>送信する</Submit>
        </div>
      </form>
    </div>
  )
}
