// メモ帳アプリのロジック
// 保存はできるが、どこにも残らない（localStorageは壁紙のキーだけと決めているため）。
// PC（ウィンドウ）とSP（アプリ）に同じDOMがあるので [data-memo] を全部拾う。

const SOFT_LIMIT = 640

const SAVE_MESSAGES = [
  '保存しました。電源を切るまでは残ります。',
  '保存しました（さっきと同じ場所に）。',
  '保存しました。保存先は640KBのうちのこの一角です。',
  'これ以上保存しても、増えるのは自信だけです。',
]

const STATE_UNSAVED = '未保存（自動保存はOFF）'
const STATE_SAVED = '保存済み（メモリ上）'

function setupNotepad(root: HTMLElement): void {
  const text = root.querySelector<HTMLTextAreaElement>('[data-memo-text]')
  const count = root.querySelector<HTMLElement>('[data-memo-count]')
  const stateEl = root.querySelector<HTMLElement>('[data-memo-state]')
  const message = root.querySelector<HTMLElement>('[data-memo-message]')
  const saveButton = root.querySelector<HTMLElement>('[data-memo-save]')
  const clearButton = root.querySelector<HTMLElement>('[data-memo-clear]')
  if (!text) return

  let saveCount = 0
  let clearArmed = false
  let overLimitNoticed = false

  const say = (line: string) => {
    if (message) message.textContent = line
  }

  const setState = (label: string) => {
    if (stateEl) stateEl.textContent = label
  }

  const renderCount = () => {
    if (count) count.textContent = `${text.value.length}文字`
  }

  text.addEventListener('input', () => {
    renderCount()
    setState(STATE_UNSAVED)
    clearArmed = false

    if (text.value.length > SOFT_LIMIT) {
      if (!overLimitNoticed) {
        overLimitNoticed = true
        say('640文字をこえました。じゅうぶんでは？')
      }
    } else {
      overLimitNoticed = false
    }
  })

  saveButton?.addEventListener('click', () => {
    if (text.value.trim() === '') {
      setState('保存済み（空）')
      say('空のメモを保存しました。容量の節約になります。')
      return
    }
    setState(STATE_SAVED)
    say(SAVE_MESSAGES[Math.min(saveCount, SAVE_MESSAGES.length - 1)] ?? SAVE_MESSAGES[0] ?? '')
    saveCount += 1
  })

  clearButton?.addEventListener('click', () => {
    if (text.value === '') {
      say('すでに何もありません。')
      return
    }
    // 一度目は聞き返す（消したあとに戻す手段がないので）
    if (!clearArmed) {
      clearArmed = true
      say('ほんとうに消しますか？ もう一度おしてください。')
      return
    }
    text.value = ''
    clearArmed = false
    overLimitNoticed = false
    renderCount()
    setState(STATE_UNSAVED)
    say('消しました。取り消しはできません（Undoはv27で対応予定）')
    text.focus()
  })

  renderCount()
  setState(STATE_UNSAVED)
}

export function setupNotepads(): void {
  document.querySelectorAll<HTMLElement>('[data-memo]').forEach(setupNotepad)
}
