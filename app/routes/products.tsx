import { createRoute } from 'honox/factory';
import Menu from '../components/menu';

export default createRoute(async (c) => {
  return c.render(
    <div className="container">
      <table border={1} cellSpacing={0} cellPadding={5} align="center" bgcolor="#FFFFFF">
        <tr>
          <td colSpan={2} align="center" bgcolor="#000000">
            <h1 className="blink">tomokisunのプロダクト一覧</h1>
            <div className="under-construction">
              <span>常に工事中</span>
            </div>
          </td>
        </tr>
        <tr>
          <Menu c={c} />
          <td width={600} valign="top">
            <div className="content">
              <a name="calculatormultiple"></a>
              <div className="section">
                <div className="section-header">
                  CalculatorMultiple
                </div>
                <div className="section-content">
                  <p>デバイスを横向きにすると、3つの計算機が表示されます。同時に複数の計算が必要な場合に使用できます。</p>
                  <p><a href="https://apps.apple.com/ng/app/calculatormultiple/id1525626543" target="_blank" rel="noopener noreferrer">https://apps.apple.com/ng/app/calculatormultiple/id1525626543</a></p>
                </div>
              </div>

              <a name="blackjack"></a>
              <div className="section">
                <div className="section-header">
                  Blackjack Counting
                </div>
                <div className="section-content">
                  <p>このアプリを使えば、誰でも簡単にブラックジャックのカウンティングができます！</p>
                  <p><a href="https://apps.apple.com/ng/app/blackjack-counting/id1544949227" target="_blank" rel="noopener noreferrer">https://apps.apple.com/ng/app/blackjack-counting/id1544949227</a></p>
                </div>
              </div>

              <a name="supernft"></a>
              <div className="section">
                <div className="section-header">
                  Super NFT Products (acq: GMO Pepabo, Inc.)
                </div>
                <div className="section-content">
                  <p>あなたが所有するオリジナルNFT商品を購入できるサービスです。</p>
                  <p><a href="https://twitter.com/0xsnp" target="_blank" rel="noopener noreferrer">https://twitter.com/0xsnp</a></p>
                </div>
              </div>

              <a name="nererun"></a>
              <div className="section">
                <div className="section-header">
                  nererun
                </div>
                <div className="section-content">
                  <p>子供たちの睡眠をサポートするために、寝かしつけに特化した読み聞かせサービスです。</p>
                  <p><a href="https://nererunkids.studio.site/" target="_blank" rel="noopener noreferrer">https://nererunkids.studio.site/</a></p>
                </div>
              </div>

              <a name="pokerone"></a>
              <div className="section">
                <div className="section-header">
                  PokerONE (acq: deck, Inc.)
                </div>
                <div className="section-content">
                  <p>アミューズメントカジノのトーナメントを簡単に検索できるサービスです。</p>
                  <p><a href="https://twitter.com/pokerone_jp" target="_blank" rel="noopener noreferrer">https://twitter.com/pokerone_jp</a></p>
                  <div className="marquee-container">
                    <marquee scrollamount="3" behavior="alternate">プロダクト一覧 👀</marquee>
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
