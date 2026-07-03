import Window from '../Window'

type AboutWindowProps = {
  open?: boolean
  year?: number
}

export default function AboutWindow({ open = false, year = new Date().getFullYear() }: AboutWindowProps) {
  return (
    <Window id="about" title="このOSについて" color="yellow" open={open}>
      <div className="about-body">
        <div className="about-logo" aria-hidden="true">
          ⌘
        </div>
        <div className="about-name">tomokiOS 1.0</div>
        <div className="about-tagline">〜 素通り禁止オペレーティングシステム 〜</div>
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
            <dd>HonoX on Cloudflare Workers</dd>
          </div>
        </dl>
        <p className="about-footer">
          <a href="https://github.com/tomokisun/tomokisun.com" target="_blank" rel="noopener noreferrer">
            ソースコード
          </a>{' '}
          ｜ © {year} tomokisun
        </p>
      </div>
    </Window>
  )
}
