import Window from '../Window'

export default function ProfileWindow() {
  return (
    <Window id="profile" title="プロフィール.txt" color="cherry" open statusBar="UTF-8 ｜ プレーンテキスト ｜ 変更なし">
      <div className="txt-doc">
        <p>
          <span className="txt-key">なまえ</span>: tomokisun
        </p>
        <p>
          <span className="txt-key">しょくぎょう</span>: iOS出身のなんでも屋
        </p>
        <p className="txt-body">
          元々はiOSエンジニアですが、現在はモバイル、ウェブ、バックエンド、ブロックチェーンなど、様々な分野に携わっています。
          「1日1個アプリを作る」挑戦を90日間完遂しました。
        </p>
        <p>
          <span className="txt-key">いま</span>: ONE, Inc.（友人と共同創業）
        </p>
        <p className="txt-body">10代向けのソーシャルモバイルアプリを開発中です。</p>
        <p>
          <span className="txt-key">まえ</span>: CAMPFIRE, Inc.
        </p>
        <p className="txt-body">
          日本最大級のクラウドファンディングサイトで、モバイルアプリのローンチを担当。立ち上げ期は3人のエンジニアで、その後はiOS・Android・APIサーバーをほぼひとりで開発していました。
        </p>
        <p>
          <span className="txt-key">にがて</span>: インフラ層（笑）→{' '}
          <a href="#win-trash" data-open="trash">
            ゴミ箱に捨てました
          </a>
        </p>
      </div>
    </Window>
  )
}
