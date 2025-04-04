import FormField from '../components/molecules/FormField'
import Submit from '../components/atoms/Submit'

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
          <Submit><span>送信する</span></Submit>
        </div>
      </form>
    </div>
  )
}
