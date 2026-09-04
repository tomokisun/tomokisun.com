// つながり系のアプリ: メッセージ / メール / ビデオ通話 / 電話 / 連絡先 / インビテーション。

import { socialLinks } from '@/data/social-links'
import { AppDoc, AppHero, Bubble, List, ListRow, Note, opens, Quip, Row, Rows, Section, Toolbar } from './kit'

export function MessagesBody() {
  return (
    <AppDoc className="ak-messages">
      <div className="ak-thread-head">
        <span className="ak-list-icon tile-cherry" aria-hidden="true">
          🍈
        </span>
        <span>
          <strong>tomokisun</strong>
          <span className="ak-list-desc">自動応答（本人は寝ています）</span>
        </span>
      </div>
      <div className="ak-thread" data-messages-thread>
        <Bubble from="them">こんにちは。tomokiOS へようこそ。</Bubble>
        <Bubble from="them">なにか聞いてください。だいたい返します（だいたい）。</Bubble>
      </div>
      <form className="ak-add" data-messages-form>
        <input
          className="ak-input"
          type="text"
          data-messages-input
          placeholder="メッセージを入力"
          aria-label="メッセージを入力"
          maxLength={80}
        />
        <button type="submit" className="os-button">
          送信
        </button>
      </form>
      <div className="ak-chips">
        {['はじめまして', 'インフラは？', 'おすすめのアプリは？', '640KB'].map((suggestion) => (
          <button key={suggestion} type="button" className="ak-chip ak-chip--button" data-messages-quick={suggestion}>
            {suggestion}
          </button>
        ))}
      </div>
      <Note>既読はつきません。つけると急かされている気がするので、この機能は実装していません。</Note>
    </AppDoc>
  )
}

const MAILS = [
  {
    from: 'tomokisun（自分）',
    subject: '【重要】インフラを勉強すること',
    date: '2019/04/01',
    body: '未来の自分へ。そろそろ Kubernetes をやること。以上。',
    unread: true,
  },
  {
    from: 'tomokisun（自分）',
    subject: 'Re: 【重要】インフラを勉強すること',
    date: '2026/09/01',
    body: 'まだです。ゴミ箱に infra.zip として保管しています。復元はできません。',
    unread: true,
  },
  {
    from: 'tomokiOS システム',
    subject: 'ストレージがのこり1KBです',
    date: '今日',
    body: '640KB のうち 639KB を使用しています。じゅうぶんです。対応は不要です。',
    unread: true,
  },
]

export function MailBody() {
  return (
    <AppDoc>
      <List>
        {MAILS.map((mail) => (
          <ListRow
            key={mail.subject}
            icon={mail.unread ? '●' : '○'}
            color={mail.unread ? 'soda' : 'cream'}
            title={mail.subject}
            desc={`${mail.from} — ${mail.body}`}
            meta={mail.date}
            action
            data-quip={mail.body}
          />
        ))}
      </List>
      <Toolbar>
        <Quip label="新規メッセージ" quip="宛先を入力してください。……宛先が思いつきませんでした。" />
        <Quip label="すべて既読にする" quip="既読にしました。読んでいませんが。" />
      </Toolbar>
      <Note>迷惑メールフォルダは空です。このアドレスは、ほぼ自分にしか使っていません。</Note>
    </AppDoc>
  )
}

export function FaceTimeBody() {
  return (
    <AppDoc>
      <div className="ak-call" data-facetime>
        <div className="ak-call-screen">
          <span className="ak-call-avatar" aria-hidden="true">
            🍈
          </span>
          <span className="ak-call-name">tomokisun</span>
          <span className="ak-call-status" data-facetime-status aria-live="polite">
            カメラは経費削減されました
          </span>
        </div>
        <Toolbar>
          <button type="button" className="os-button" data-facetime-call>
            発信
          </button>
          <Quip label="エフェクト" quip="使えるエフェクトは「絵文字になる」だけです。すでに絵文字です。" />
        </Toolbar>
      </div>
      <Rows>
        <Row label="通話履歴" value="0 件" hint="回線は良好です" />
        <Row label="画質" value="640×480" hint="640つながり" />
      </Rows>
      <Note>かかってきたことはありません。着信音は毎年ちゃんと選び直しています。</Note>
    </AppDoc>
  )
}

const CALLS = [
  { name: '本人', detail: '発信 — 0秒', icon: '📤', color: 'melon' as const, quip: '自分にかけました。すぐ出ました。' },
  {
    name: '不明な番号',
    detail: '不在着信 — 2006年',
    icon: '📵',
    color: 'cream' as const,
    quip: 'たぶん光回線の勧誘です。20年経ちました。',
  },
  {
    name: '留守番電話',
    detail: '1 件（未再生）',
    icon: '📼',
    color: 'lavender' as const,
    quip: '「もしもし、聞こえてますか」だけで終わっています。',
  },
]

export function PhoneBody() {
  return (
    <AppDoc>
      <Section title="履歴">
        <List>
          {CALLS.map((call) => (
            <ListRow
              key={call.name}
              icon={call.icon}
              color={call.color}
              title={call.name}
              desc={call.detail}
              action
              data-quip={call.quip}
            />
          ))}
        </List>
      </Section>
      <Section title="キーパッド">
        <div className="ak-keypad" data-keypad>
          <div className="ak-keypad-display" data-keypad-display aria-live="polite">
            &nbsp;
          </div>
          <div className="ak-keypad-keys">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '＊', '0', '#'].map((key) => (
              <button key={key} type="button" className="ak-keypad-key" data-keypad-key={key}>
                {key}
              </button>
            ))}
          </div>
          <Toolbar>
            <button type="button" className="os-button" data-keypad-call>
              発信
            </button>
            <button type="button" className="os-button" data-keypad-del>
              ⌫
            </button>
          </Toolbar>
        </div>
      </Section>
      <Toolbar>
        <button type="button" className="os-button" {...opens('contacts')}>
          連絡先をひらく
        </button>
      </Toolbar>
      <Note>640 とだけ押して発信すると、ちょっとだけ良いことがあります。</Note>
    </AppDoc>
  )
}

export function ContactsBody() {
  return (
    <AppDoc>
      <AppHero icon="🍈" title="tomokisun" sub="ONE, Inc. ／ iOS出身のなんでも屋" color="cherry" />
      <Section title="連絡方法">
        <List>
          {socialLinks.map((link) => (
            <ListRow
              key={link.platform}
              icon={link.icon}
              color="soda"
              title={link.platform}
              desc={link.display}
              meta={link.url ? '↗' : 'ID のみ'}
            />
          ))}
        </List>
      </Section>
      <Rows>
        <Row label="ふりがな" value="ともきさん" />
        <Row label="所在地" value="机の上" hint="出社率100%" />
        <Row label="誕生日" value="SINCE 2006" hint="OSと同い年" />
      </Rows>
      <Note>グループ機能はありません。1件しかないので、分ける意味がありませんでした。</Note>
    </AppDoc>
  )
}

export function InvitesBody() {
  return (
    <AppDoc>
      <div className="ak-invite">
        <div className="ak-invite-card tile-cherry">
          <span className="ak-invite-emoji" aria-hidden="true">
            🍈
          </span>
          <strong className="ak-invite-title">tomokiOS 26 発表会</strong>
          <span className="ak-invite-when">いつか ｜ 机の上</span>
          <span className="ak-invite-desc">640KBで足りることを証明する会</span>
        </div>
      </div>
      <Rows>
        <Row label="主催" value="tomokisun" />
        <Row label="参加者" value="1名" hint="主催者本人" />
        <Row label="持ち物" value="フロッピー（あれば）" />
      </Rows>
      <Toolbar>
        <Quip label="参加する" quip="参加登録しました。参加者は2名になりました（あなたと本人）。" />
        <Quip label="共有" quip="共有リンクを作りました。共有先が見つかりませんでした。" />
        <button type="button" className="os-button" {...opens('calendar')}>
          カレンダーで見る
        </button>
      </Toolbar>
      <Note>返事の期限はありません。開催日も決まっていないので、いつ返事をしても間に合います。</Note>
    </AppDoc>
  )
}
