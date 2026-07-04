import Window from '../Window'

export default function AboutWindow() {
  return (
    <Window id="about" title="このOSについて" color="cream">
      <div className="about-body">
        <div className="about-logo" aria-hidden="true">
          🍈
        </div>
        <div className="about-name">tomokiOS 26</div>
        <div className="about-tagline">"Cream Soda" — 素通り禁止オペレーティングシステム</div>
        <dl className="about-specs">
          <div>
            <dt>プロセッサ</dt>
            <dd>なつかしさ 100%</dd>
          </div>
          <div>
            <dt>メモリ</dt>
            <dd>640KB（じゅうぶんなはず）</dd>
          </div>
          <div>
            <dt>稼働開始</dt>
            <dd>SINCE 2006</dd>
          </div>
          <div>
            <dt>カーネル</dt>
            <dd>Next.js + OpenNext on Cloudflare Workers</dd>
          </div>
          <div>
            <dt>コードネーム</dt>
            <dd>Cream Soda</dd>
          </div>
        </dl>
        <p className="about-footer">
          <a href="https://github.com/tomokisun/tomokisun.com" target="_blank" rel="noopener noreferrer">
            ソースコード
          </a>{' '}
          ｜ © 2006–2026 tomokisun. 権利はだいたい本人にあります。
        </p>
      </div>
    </Window>
  )
}
