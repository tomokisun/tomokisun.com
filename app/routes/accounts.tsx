import { createRoute } from 'honox/factory'
import Menu from '../components/menu';

export default createRoute(async (c) => {
  return c.render(
    <div className="container">
      <table border={1} cellSpacing={0} cellPadding={5} align="center" bgcolor="#FFFFFF">
        <tr>
          <td colSpan={2} align="center" bgcolor="#000000">
            <h1 className="blink">tomokisunのアカウント一覧</h1>
            <div className="under-construction">
              <span>常に工事中</span>
            </div>
          </td>
        </tr>
        <tr>
          <Menu c={c} />
          <td width={600} valign="top">
            <div className="content">
              <a name="social"></a>
              <div className="section">
                <div className="section-header">
                  ソーシャル
                </div>
                <div className="section-content">
                  <ul>
                    <li>Email: <a href="mailto:tomoki69386@gmail.com">tomoki69386@gmail.com</a></li>
                    <li>Facebook: <a href="https://facebook.com/tomokisun" target="_blank" rel="noopener noreferrer">tomokisun</a></li>
                    <li>LinkedIn: <a href="https://linkedin.com/in/tomokisun" target="_blank" rel="noopener noreferrer">tomokisun</a></li>
                    <li>Instagram: <a href="https://instagram.com/tomokisun" target="_blank" rel="noopener noreferrer">tomokisun</a></li>
                    <li>Twitter: <a href="https://twitter.com/tomokisun" target="_blank" rel="noopener noreferrer">tomokisun</a></li>
                    <li>Discord: tomokisun#1557</li>
                    <li>Telegram: <a href="https://t.me/tomokisun" target="_blank" rel="noopener noreferrer">tomokisun</a></li>
                    <li>Bondee: tomokisun</li>
                    <li>ZEPETO: <a href="https://web.zepeto.me/tomokisun" target="_blank" rel="noopener noreferrer">tomokisun</a></li>
                  </ul>
                  <div className="marquee-container">
                    <marquee scrollamount="3" behavior="alternate">ソーシャルメディアでフォローしてね 👀</marquee>
                  </div>
                </div>
              </div>
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
