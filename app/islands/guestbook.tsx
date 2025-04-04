import { useState } from 'hono/jsx'

export default function Guestbook() {
  const [activeTab, setActiveTab] = useState(0)

  // タブをクリックしたときの処理
  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  // フォーム送信の処理
  const handleSubmit = () => {
    const nameInput = document.querySelector('.guestbook-form input[type="text"]') as HTMLInputElement
    const messageInput = document.querySelector('.guestbook-form textarea') as HTMLTextAreaElement
    
    if (!nameInput || !messageInput) return
    
    // 簡易バリデーション
    if (!nameInput.value.trim()) {
      alert('お名前を入力してください。')
      nameInput.focus()
      return
    }
    
    if (!messageInput.value.trim()) {
      alert('メッセージを入力してください。')
      messageInput.focus()
      return
    }
    
    // 実際のアプリケーションでは、ここでサーバーにデータを送信する処理を追加
    // この例では、送信成功のアラートを表示するだけ
    alert('ゲストブックに署名しました！ありがとうございます。')
    
    // フォームをリセット
    nameInput.value = ''
    messageInput.value = ''
  }

  return (
    <div className="guestbook">
      <div className="guestbook-header">
        <span className="guestbook-icon">📝</span>
        掲示板
        <span className="guestbook-icon">📝</span>
      </div>
      
      <div className="guestbook-tabs">
        <div 
          className={`guestbook-tab ${activeTab === 0 ? 'guestbook-tab-active' : ''}`}
          onClick={() => handleTabClick(0)}
        >
          署名する
        </div>
        <div 
          className={`guestbook-tab ${activeTab === 1 ? 'guestbook-tab-active' : ''}`}
          onClick={() => handleTabClick(1)}
        >
          メッセージを読む
        </div>
      </div>
      
      <div className="guestbook-content">
        <div className="guestbook-form" style={{ display: activeTab === 0 ? 'block' : 'none' }}>
          <form>
            <table className="guestbook-form-table">
              <tr>
                <td className="guestbook-label">お名前:</td>
                <td><input type="text" className="form-input" placeholder="あなたのお名前" /></td>
              </tr>
              <tr>
                <td className="guestbook-label">メッセージ:</td>
                <td><textarea className="form-input guestbook-textarea" placeholder="ここにメッセージを入力してください"></textarea></td>
              </tr>
            </table>
            <div className="guestbook-submit-container">
              <button type="button" className="submit-button" onClick={handleSubmit}>
                <span className="submit-button-text">送信する</span>
              </button>
            </div>
          </form>
        </div>
        
        <div className="guestbook-entries" style={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <div className="guestbook-entry">
            <div className="guestbook-entry-header">
              <span className="guestbook-entry-name">田中太郎</span>
              <span className="guestbook-entry-date">2025年4月3日</span>
            </div>
            <div className="guestbook-entry-content">
              素晴らしいウェブサイトですね！90年代のデザインが懐かしいです。
            </div>
          </div>
          
          <div className="guestbook-entry">
            <div className="guestbook-entry-header">
              <span className="guestbook-entry-name">佐藤花子</span>
              <span className="guestbook-entry-date">2025年4月2日</span>
            </div>
            <div className="guestbook-entry-content">
              初めまして！あなたの経歴に興味があります。またお話しましょう。
            </div>
          </div>
          
          <div className="guestbook-entry">
            <div className="guestbook-entry-header">
              <span className="guestbook-entry-name">鈴木一郎</span>
              <span className="guestbook-entry-date">2025年4月1日</span>
            </div>
            <div className="guestbook-entry-content">
              このサイトのデザインが素敵です！昔のインターネットを思い出します。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
