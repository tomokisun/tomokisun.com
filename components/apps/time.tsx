// 時間まわりのアプリ: 時計 / カレンダー / リマインダー。
// 生きている数字（現在時刻・今日・ストップウォッチ）は lib/apps/time.ts が入れ替える。

import { AppDoc, List, ListRow, Note, Quip, Row, Rows, Section, Segmented, SegPane, Toolbar } from './kit'

const WORLD_CLOCKS = [
  { city: '東京', tz: 'Asia/Tokyo', note: 'ここ' },
  { city: 'クパチーノ', tz: 'America/Los_Angeles', note: '本社（憧れ）' },
  { city: 'ロンドン', tz: 'Europe/London', note: '起きているころ' },
  { city: 'UTC', tz: 'UTC', note: '争いのない時刻' },
]

const ALARMS = [
  { time: '06:30', label: '早起きする', on: false, quip: 'このアラームは2019年から一度も鳴っていません。' },
  { time: '09:00', label: '始業（自称）', on: true, quip: '鳴りました。すでに起きているので意味はありません。' },
  { time: '25:00', label: '寝る', on: false, quip: '25時は存在しない時刻なので、永遠に鳴りません。' },
]

const TIMERS = [
  { label: '3分', seconds: 180, note: 'カップ麺' },
  { label: '5分', seconds: 300, note: '「あと5分」' },
  { label: '25分', seconds: 1500, note: 'ポモドーロ（1回だけ成功）' },
]

export function ClockBody() {
  return (
    <AppDoc>
      <Segmented
        name="clock"
        tabs={[
          { value: 'world', label: '世界時計' },
          { value: 'alarm', label: 'アラーム' },
          { value: 'stopwatch', label: 'ストップ' },
          { value: 'timer', label: 'タイマー' },
        ]}
      />
      <SegPane name="clock" value="world">
        <List>
          {WORLD_CLOCKS.map((clock) => (
            <ListRow
              key={clock.tz}
              icon="🕐"
              color="soda"
              title={clock.city}
              desc={clock.note}
              meta={
                <span className="ak-bigtime" data-clock-tz={clock.tz}>
                  --:--
                </span>
              }
            />
          ))}
        </List>
        <Note>時差は正確です。約束の時間に間に合うかどうかは、また別の問題です。</Note>
      </SegPane>
      <SegPane name="clock" value="alarm">
        <List>
          {ALARMS.map((alarm) => (
            <ListRow
              key={alarm.time}
              icon={alarm.on ? '🔔' : '🔕'}
              color={alarm.on ? 'cherry' : 'cream'}
              title={<span className="ak-bigtime">{alarm.time}</span>}
              desc={alarm.label}
              meta={alarm.on ? 'ON' : 'OFF'}
              action
              data-quip={alarm.quip}
            />
          ))}
        </List>
        <Note>スヌーズは9分です。9回まで押した記録があります。</Note>
      </SegPane>
      <SegPane name="clock" value="stopwatch">
        <div className="ak-stopwatch" data-stopwatch>
          <div className="ak-stopwatch-display" data-sw-display aria-live="off">
            00:00.00
          </div>
          <Toolbar>
            <button type="button" className="os-button" data-sw-toggle>
              スタート
            </button>
            <button type="button" className="os-button" data-sw-lap>
              ラップ
            </button>
            <button type="button" className="os-button os-button--danger" data-sw-reset>
              リセット
            </button>
          </Toolbar>
          <ol className="ak-lap-list" data-sw-laps />
        </div>
        <Note>本当に動きます。このOSでいちばん実用的な機能かもしれません。</Note>
      </SegPane>
      <SegPane name="clock" value="timer">
        <div className="ak-timer" data-timer>
          <div className="ak-stopwatch-display" data-timer-display aria-live="off">
            00:00
          </div>
          <div className="ak-chips">
            {TIMERS.map((timer) => (
              <button
                key={timer.seconds}
                type="button"
                className="ak-chip ak-chip--button"
                data-timer-set={timer.seconds}
              >
                {timer.label}
              </button>
            ))}
          </div>
          <Toolbar>
            <button type="button" className="os-button" data-timer-toggle>
              開始
            </button>
            <button type="button" className="os-button os-button--danger" data-timer-reset>
              取消
            </button>
          </Toolbar>
          <p className="ak-note" data-timer-note aria-live="polite">
            {TIMERS.map((t) => `${t.label}=${t.note}`).join(' ｜ ')}
          </p>
        </div>
      </SegPane>
    </AppDoc>
  )
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const EVENTS = [
  { day: '毎日', title: '開発', color: 'melon' as const, time: '起きてから寝るまで' },
  { day: '毎週火', title: '「インフラを勉強する」', color: 'lavender' as const, time: '延期' },
  { day: '毎月末', title: 'ブログを書く', color: 'cherry' as const, time: '書けたら' },
  { day: '2026/08/28', title: 'Wablo をリリース', color: 'soda' as const, time: '完了' },
]

/** サーバー側では「その瞬間の月」を描き、lib/apps/time.ts が閲覧者の今日で描き直す */
function monthCells(now: Date): (number | null)[] {
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const cells: (number | null)[] = Array.from({ length: first.getDay() }, () => null)
  for (let d = 1; d <= days; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function CalendarBody() {
  const now = new Date()
  const today = now.getDate()
  return (
    <AppDoc>
      <div className="ak-cal" data-calendar>
        <div className="ak-cal-head">
          <span className="ak-cal-month" data-cal-month>
            {now.getFullYear()}年{now.getMonth() + 1}月
          </span>
          <span className="ak-cal-sub">予定はだいたい「開発」</span>
        </div>
        <div className="ak-cal-grid" data-cal-grid>
          {WEEKDAYS.map((day) => (
            <span key={day} className="ak-cal-dow">
              {day}
            </span>
          ))}
          {monthCells(now).map((day, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: 週の枠は位置そのものが意味を持つ
              key={i}
              className={`ak-cal-day${day === null ? ' is-empty' : ''}${day === today ? ' is-today' : ''}`}
            >
              {day ?? ''}
            </span>
          ))}
        </div>
      </div>
      <Section title="この先の予定">
        <List>
          {EVENTS.map((event) => (
            <ListRow
              key={event.title}
              icon="●"
              color={event.color}
              title={event.title}
              desc={event.day}
              meta={event.time}
            />
          ))}
        </List>
      </Section>
      <Note>「あとでやる」は予定ではないので、このカレンダーには入りません。</Note>
    </AppDoc>
  )
}

const REMINDERS = [
  { text: 'インフラを勉強する', note: '2019年から書いてあります', done: false },
  { text: 'ブログの2記事目を書く', note: '下書きゼロ', done: false },
  { text: 'このOSにアプリを増やす', note: '増えました', done: true },
  { text: '640KBで足りるか確認する', note: '足りました', done: true },
]

export function RemindersBody() {
  return (
    <AppDoc>
      <div className="ak-reminders" data-reminders>
        <form className="ak-add" data-reminder-form>
          <input
            className="ak-input"
            type="text"
            data-reminder-input
            placeholder="あたらしいリマインダー"
            aria-label="あたらしいリマインダー"
            maxLength={60}
          />
          <button type="submit" className="os-button">
            追加
          </button>
        </form>
        <ul className="ak-check-list" data-reminder-list>
          {REMINDERS.map((item) => (
            <li key={item.text} className={`ak-check-item${item.done ? ' is-done' : ''}`}>
              <button type="button" className="ak-check-box" data-reminder-toggle aria-pressed={item.done}>
                {item.done ? '✓' : ''}
              </button>
              <span className="ak-check-text">
                <span className="ak-check-title">{item.text}</span>
                <span className="ak-check-note">{item.note}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="ak-note" data-reminder-count aria-live="polite">
          2 件のこっています
        </p>
      </div>
      <Rows>
        <Row label="通知" value="しません" hint="言われなくても気にしています" />
        <Row label="同期" value="この画面のあいだだけ" />
      </Rows>
      <Toolbar>
        <Quip label="ぜんぶ完了にする" quip="完了にしました。現実は変わっていません。" />
      </Toolbar>
    </AppDoc>
  )
}
