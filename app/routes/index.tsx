import { createRoute } from 'honox/factory'
import Guestbook from '../islands/guestbook'
import Menu from '../components/menu'

export default createRoute(async (c) => {
  return c.render(
    <div className="container">
      <table border={1} cellSpacing={0} cellPadding={5} align="center" bgcolor="#FFFFFF">
        <tr>
          <td colSpan={2} align="center" bgcolor="#000000">
            <h1 className="blink">tomokisunのホームページへようこそ</h1>
            <div className="under-construction">
              <span>常に工事中</span>
            </div>
          </td>
        </tr>
        <tr>
          <Menu c={c} />
          <td width={600} valign="top">
            <div className="content">
              <a name="about"></a>
              <div className="section">
                <div className="section-header">
                  自己紹介
                </div>
                <div className="section-content">
                  <span className="name">tomokisun</span>
                  <p>元々はiOSエンジニアですが、現在はモバイル、ウェブ、バックエンド、ブロックチェーンなど、様々な分野に携わっています。</p>
                  <p>ただ、インフラ層は得意ではないです（笑）</p>
                  <div className="marquee-container">
                    <marquee scrollamount="3" behavior="alternate">個人ウェブサイト 👀</marquee>
                  </div>
                </div>
              </div>
              
              <hr className="rainbow" />
              
              <a name="job"></a>
              <div className="section">
                <div className="section-header">
                  職歴
                </div>
                <div className="section-content">
                  <p><blink>ONE, Inc. - now</blink></p>
                  <p>友人と一緒にこの会社を共同設立しました。</p>
                  <p>現在、10代向けのソーシャルモバイルアプリを開発中です。</p>
                </div>
                <div className="section-content">
                  <p><blink>CAMPFIRE, Inc. - prev</blink></p>
                  <p>日本最大級のクラウドファンディングサイトの一つです。</p>
                  <p>モバイルアプリのローンチを担当。</p>
                  <p>立ち上げ期は3人のエンジニアで担当していましたが、その後はiOS、Android、APIサーバーなど、ほぼ一人ですべての開発を担当していました。</p>
                </div>
              </div>
              
              <hr className="rainbow" />
              
              <Guestbook />
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={2} align="center" bgcolor="#000000" className="footer">
            <div>© 2025 tomokisun - 最終更新日: 2025年4月4日</div>
          </td>
        </tr>
      </table>
    </div>
  )
})
