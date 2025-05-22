import FormField from '../molecules/FormField'
import Submit from '../atoms/Submit'

type GuestbookFormProps = {
  captchaQuestion: string
  sessionId: string
  className?: string
}

export default function GuestbookForm({ captchaQuestion, sessionId, className = '' }: GuestbookFormProps) {
  return (
    <div className={`guestbook-form ${className}`}>
      <form method='post'>
        <input type="hidden" name="sessionId" value={sessionId} />
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
          <tr>
            <td className="guestbook-label">
              <label htmlFor="captcha">認証:</label>
            </td>
            <td>
              <div className="captcha-container">
                <div className="captcha-question">{captchaQuestion}</div>
                <input 
                  type="text" 
                  name="captcha" 
                  id="captcha"
                  className="form-input captcha-input" 
                  placeholder="答えを入力"
                  required
                  pattern="[0-9]{1,3}"
                  title="数字で答えを入力してください"
                />
              </div>
            </td>
          </tr>
          {/* ハニーポット（bot対策用の隠しフィールド） */}
          <input 
            type="text" 
            name="email" 
            style={{ display: 'none', position: 'absolute', left: '-9999px' }}
            tabIndex={-1}
            autoComplete="off"
          />
        </table>
        <div className="guestbook-submit-container">
          <Submit>送信する</Submit>
        </div>
      </form>
    </div>
  )
}
