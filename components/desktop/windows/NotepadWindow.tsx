import NotepadBody from '../../apps/NotepadBody'
import Window from '../Window'

export default function NotepadWindow() {
  return (
    <Window id="memo" title="メモ.txt — メモ帳" color="cream" statusBar="UTF-8 ｜ 保存先: メモリ ｜ 次の再起動まで有効">
      <NotepadBody />
    </Window>
  )
}
