// 仕事道具のアプリ: 表計算 / 文書 / スライド / フリーボード / ジャーナル /
// スティッキーズ / テキストエディット。
// 「書けるが残らない」のはメモ帳と同じ方針（保存はメモリ上だけ）。

import { AppDoc, List, ListRow, Note, Quip, Row, Rows, Section, Toolbar } from './kit'

const SHEET_ROWS = [
  { label: 'ドメイン代', amount: '1,408' },
  { label: 'Cloudflare', amount: '0' },
  { label: 'コーヒー', amount: '12,800' },
  { label: 'インフラ学習書', amount: '3,960' },
]

export function NumbersBody() {
  return (
    <AppDoc>
      <div className="ak-sheet" data-sheet>
        <div className="ak-sheet-row ak-sheet-head">
          <span>項目</span>
          <span>今月</span>
          <span>先月</span>
        </div>
        {SHEET_ROWS.map((row) => (
          <div key={row.label} className="ak-sheet-row">
            <span className="ak-sheet-label">{row.label}</span>
            <input
              className="ak-cell"
              data-sheet-cell
              defaultValue={row.amount}
              inputMode="numeric"
              aria-label={`${row.label} 今月`}
            />
            <input
              className="ak-cell"
              data-sheet-cell
              defaultValue={row.amount}
              inputMode="numeric"
              aria-label={`${row.label} 先月`}
            />
          </div>
        ))}
        <div className="ak-sheet-row ak-sheet-total">
          <span>合計</span>
          <span data-sheet-total="0">0</span>
          <span data-sheet-total="1">0</span>
        </div>
      </div>
      <Note>セルは編集できます。合計はちゃんと計算されます。ただし保存はされません（このOSの共通仕様です）。</Note>
      <Toolbar>
        <Quip label="グラフを追加" quip="円グラフを作りました。9割がコーヒーでした。" />
      </Toolbar>
    </AppDoc>
  )
}

export function PagesBody() {
  return (
    <AppDoc>
      <div className="ak-paper">
        <textarea
          className="ak-paper-area"
          data-doc="pages"
          aria-label="文書"
          spellCheck={false}
          defaultValue={'インフラ層との向き合いかたについて\n\n第1章 　まず、逃げる\n'}
        />
      </div>
      <div className="ak-doc-status">
        <span data-doc-count="pages">0 文字</span>
        <span>自動保存: OFF</span>
      </div>
      <Toolbar>
        <Quip label="書き出す" quip="PDFに書き出しました。保存先が見つからないので、そのまま消えました。" />
        <Quip label="共有" quip="共同編集を開始しました。参加者は1名です。" />
      </Toolbar>
      <Note>第1章の1行目で止まっています。2章の構想はあります（頭の中に）。</Note>
    </AppDoc>
  )
}

const SLIDES = [
  { n: 1, title: 'tomokiOS 26', body: '素通り禁止オペレーティングシステム' },
  { n: 2, title: '課題', body: 'ホームページは、だいたい素通りされる' },
  { n: 3, title: '解決', body: 'OSにしてしまえば、触ってもらえる' },
  { n: 4, title: '技術', body: 'Next.js + OpenNext / Cloudflare Workers' },
  { n: 5, title: '必要メモリ', body: '640KB' },
]

export function KeynoteBody() {
  return (
    <AppDoc>
      <div className="ak-slides" data-slides>
        <div className="ak-slide" data-slide-view>
          <strong className="ak-slide-title" data-slide-title>
            tomokiOS 26
          </strong>
          <span className="ak-slide-body" data-slide-body>
            素通り禁止オペレーティングシステム
          </span>
          <span className="ak-slide-no" data-slide-no>
            1 / 5
          </span>
        </div>
        <Toolbar>
          <button type="button" className="os-button" data-slide-prev>
            ◀
          </button>
          <button type="button" className="os-button" data-slide-next>
            ▶
          </button>
          <Quip label="発表を開始" quip="発表を開始しました。聴衆は0名です。練習にはちょうどいい人数です。" />
        </Toolbar>
      </div>
      <ol className="ak-slide-list">
        {SLIDES.map((slide) => (
          <li key={slide.n}>
            <button type="button" className="ak-track" data-slide-go={slide.n - 1}>
              <span className="ak-track-no">{slide.n}</span>
              <span className="ak-track-text">
                <span className="ak-track-title">{slide.title}</span>
                <span className="ak-track-artist">{slide.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <Note>5枚で終わる事業計画です。長い資料は読まれない、というのが本人の持論です。</Note>
    </AppDoc>
  )
}

export function FreeformBody() {
  return (
    <AppDoc>
      <div className="ak-board" data-board>
        <canvas
          className="ak-board-canvas"
          data-board-canvas
          width={640}
          height={360}
          aria-label="フリーボード（指やマウスで描けます）"
        />
        <div className="ak-board-tools">
          {(['ink', 'cherry', 'soda', 'melon', 'cream'] as const).map((color) => (
            <button
              key={color}
              type="button"
              className={`ak-board-color tile-${color === 'ink' ? 'dark' : color}`}
              data-board-color={color}
              aria-label={`${color} で描く`}
            />
          ))}
          <button type="button" className="os-button" data-board-clear>
            消す
          </button>
        </div>
      </div>
      <Note>30秒で描いた犬は、だいたいアシカになります。仕様です（ブログにも同じことが書いてあります）。</Note>
    </AppDoc>
  )
}

export function JournalBody() {
  return (
    <AppDoc>
      <div className="ak-journal" data-journal>
        <form className="ak-add" data-journal-form>
          <input
            className="ak-input"
            type="text"
            data-journal-input
            placeholder="今日のできごとを1行で"
            aria-label="今日のできごと"
            maxLength={70}
          />
          <button type="submit" className="os-button">
            書く
          </button>
        </form>
        <ul className="ak-journal-list" data-journal-list>
          <li className="ak-journal-entry">
            <span className="ak-journal-date">2026/09/01</span>
            <span className="ak-journal-text">アプリを増やした。増やしすぎたかもしれない。</span>
          </li>
          <li className="ak-journal-entry">
            <span className="ak-journal-date">2026/08/28</span>
            <span className="ak-journal-text">Wablo を出した。へたな絵ほどよく届く。</span>
          </li>
        </ul>
      </div>
      <Rows>
        <Row label="連続記録" value="1日" hint="更新のたびに1日から" />
        <Row label="ふりかえり" value="毎年12月" hint="やったことはありません" />
      </Rows>
      <Note>3日坊主になりやすいので、1行だけ書けばよいことにしました。それでも3日です。</Note>
    </AppDoc>
  )
}

const STICKIES = [
  { color: 'cream' as const, text: '牛乳を買う\n（2019年から）' },
  { color: 'cherry' as const, text: 'ここに\nパスワードを\n書かないこと' },
  { color: 'melon' as const, text: 'あとで消す\n← 消えていない' },
]

export function StickiesBody() {
  return (
    <AppDoc>
      <div className="ak-stickies">
        {STICKIES.map((note) => (
          <div key={note.text} className={`ak-sticky tile-${note.color}`}>
            <textarea className="ak-sticky-area" defaultValue={note.text} aria-label="付箋" spellCheck={false} />
          </div>
        ))}
      </div>
      <Toolbar>
        <Quip label="新規メモ" quip="新しい付箋を貼りました。貼った瞬間から見えなくなる場所に貼られています。" />
        <Quip label="すべて剥がす" quip="剥がせませんでした。糊が強すぎるようです。" danger />
      </Toolbar>
      <Note>書き換えられます。画面を閉じると元に戻ります。付箋とはそういうものです。</Note>
    </AppDoc>
  )
}

export function TextEditBody() {
  return (
    <AppDoc>
      <div className="ak-paper ak-paper--plain">
        <textarea
          className="ak-paper-area"
          data-doc="textedit"
          aria-label="テキスト"
          spellCheck={false}
          defaultValue={'#!/bin/sh\n# このファイルは実行されません\necho "640KB"\n'}
        />
      </div>
      <div className="ak-doc-status">
        <span data-doc-count="textedit">0 文字</span>
        <span>プレーンテキスト ｜ 折り返しあり</span>
      </div>
      <Section title="最近使った項目">
        <List>
          <ListRow icon="📄" color="cream" title="名称未設定" desc="いま開いているもの" meta="未保存" />
          <ListRow icon="📄" color="cream" title="やること.txt" desc="メモ帳と内容が重複" meta="未保存" />
        </List>
      </Section>
      <Note>リッチテキストにはできません。書式で悩む時間がなくなるので、これで十分です。</Note>
    </AppDoc>
  )
}
