// 開発・あそび: オートメーター / スクリプトエディタ / Xcode / グラフ計算機 / ポーカー。

import { AppDoc, Console, List, ListRow, Note, opens, Quip, Row, Rows, Section, Toolbar } from './kit'

export function AutomatorBody() {
  return (
    <AppDoc>
      <div className="ak-automator">
        <span className="ak-automator-bot" aria-hidden="true">
          🤖
        </span>
        <div className="ak-flow">
          <div className="ak-flow-step">1. デスクトップのファイルを取得</div>
          <div className="ak-flow-step">2. 名前に「あとで」を追加</div>
          <div className="ak-flow-step">3. 何もしない</div>
        </div>
      </div>
      <Toolbar>
        <Quip label="実行" quip="ワークフローを実行しました。3ステップ目まで完璧に何もしませんでした。" />
        <Quip label="ステップを追加" quip="追加できるのは「何もしない」だけです。すでに入っています。" />
      </Toolbar>
      <Rows>
        <Row label="ワークフロー" value="1 個" />
        <Row label="実行回数" value="0 回" hint="いまのを除く" />
      </Rows>
      <Note>ロボットが手を振っている画面が好きで残しています。自動化した仕事は、まだありません。</Note>
    </AppDoc>
  )
}

export function ScriptEditorBody() {
  return (
    <AppDoc>
      <Console
        lines={[
          'tell application "tomokiOS"',
          '    activate',
          '    open window "プロフィール.txt"',
          '    display dialog "640KBあればじゅうぶん"',
          'end tell',
        ]}
      />
      <Toolbar>
        <Quip label="実行" quip="実行しました。ダイアログの代わりに、この一言が出ています。" />
        <Quip label="コンパイル" quip="コンパイルしました。構文は「雰囲気」と判定されました。" />
      </Toolbar>
      <Note>英語の文章みたいに書けるのが好きでした。読めるけれど、書けない言語でした。</Note>
    </AppDoc>
  )
}

export function XcodeBody() {
  return (
    <AppDoc>
      <div className="ak-xcode">
        <div className="ak-xcode-nav">
          <div className="ak-xcode-file is-active">tomokiOS.swift</div>
          <div className="ak-xcode-file">Wallpaper.swift</div>
          <div className="ak-xcode-file">InfraLayer.swift</div>
          <div className="ak-xcode-file is-error">Deploy.swift</div>
        </div>
        <Console
          lines={[
            'import SwiftUI',
            '',
            'struct TomokiOS: App {',
            '    // メモリは 640KB あればじゅうぶん',
            '    var body: some Scene {',
            '        WindowGroup { Desktop() }',
            '    }',
            '}',
          ]}
        />
      </div>
      <Section title="ビルドログ">
        <Console
          lines={[
            '▸ Compiling TomokiOS.swift',
            '▸ Compiling Wallpaper.swift',
            '⚠︎ InfraLayer.swift:1: warning: 未実装のまま出荷されています',
            '⚠︎ ... 他 639 件の警告',
            '✓ Build Succeeded (12.0s)',
          ]}
        />
      </Section>
      <Toolbar>
        <Quip label="▶ 実行" quip="シミュレータを起動しました。……起動しているのは、このOSでした。" />
        <Quip label="Clean Build Folder" quip="消しました。次のビルドが12分になります。" danger />
        <button type="button" className="os-button" {...opens('products')}>
          出荷したものを見る
        </button>
      </Toolbar>
      <Note>警告が640件あります。数が 640 になった時点で、直すのをやめました。</Note>
    </AppDoc>
  )
}

const FUNCS = [
  { id: 'sin', label: 'y = sin x', note: '気分の上下' },
  { id: 'quad', label: 'y = x² / 4', note: '締切前の作業量' },
  { id: 'exp', label: 'y = 2^x / 8', note: '技術的負債' },
  { id: 'decay', label: 'y = 4 / x', note: 'やる気' },
]

export function GrapherBody() {
  return (
    <AppDoc>
      <div className="ak-grapher" data-grapher>
        <svg className="ak-graph" viewBox="-6 -4 12 8" preserveAspectRatio="none" aria-label="関数のグラフ">
          <line className="ak-graph-axis" x1="-6" y1="0" x2="6" y2="0" />
          <line className="ak-graph-axis" x1="0" y1="-4" x2="0" y2="4" />
          <polyline className="ak-graph-line" data-graph-line points="" />
        </svg>
        <div className="ak-chips">
          {FUNCS.map((fn) => (
            <button key={fn.id} type="button" className="ak-chip ak-chip--button" data-graph-fn={fn.id}>
              {fn.label}
            </button>
          ))}
        </div>
        <p className="ak-note" data-graph-note aria-live="polite">
          関数を選ぶと曲がります。
        </p>
      </div>
      <List>
        {FUNCS.map((fn) => (
          <ListRow key={fn.id} icon="📉" color="soda" title={fn.label} desc={fn.note} />
        ))}
      </List>
      <Note>定義域は -6 から 6 です。それ以上のことは、このOSでは起きません。</Note>
    </AppDoc>
  )
}

export function HoldemBody() {
  return (
    <AppDoc>
      <div className="ak-poker" data-holdem>
        <div className="ak-poker-board">
          <span className="ak-poker-seat">
            <span className="ak-poker-name">ディーラー</span>
            <span className="ak-poker-cards" data-holdem-board>
              <span className="ak-card-face is-back" />
              <span className="ak-card-face is-back" />
              <span className="ak-card-face is-back" />
              <span className="ak-card-face is-back" />
              <span className="ak-card-face is-back" />
            </span>
          </span>
          <span className="ak-poker-seat">
            <span className="ak-poker-name">あなた</span>
            <span className="ak-poker-cards" data-holdem-hand>
              <span className="ak-card-face is-back" />
              <span className="ak-card-face is-back" />
            </span>
          </span>
        </div>
        <div className="ak-poker-status" data-holdem-status aria-live="polite">
          チップ 640 ｜ ブラインド 10/20
        </div>
        <Toolbar>
          <button type="button" className="os-button" data-holdem-deal>
            配る
          </button>
          <button type="button" className="os-button" data-holdem-fold>
            フォールド
          </button>
        </Toolbar>
      </div>
      <Note>
        役の判定はちゃんとやります。チップは何回負けても 640 に戻ります。減らないことが、いちばんの救済措置です。
      </Note>
    </AppDoc>
  )
}
