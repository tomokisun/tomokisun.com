import { Context } from 'hono'
import { Env } from 'hono'
import MenuItem from '../molecules/MenuItem'
import { getVisitorsCount } from '../../utils/visitors'

type MenuProps = {
  c: Context<Env, any, {}>
  className?: string
}

export default async function Menu({ c, className = '' }: MenuProps) {
  const visitorsCount = await getVisitorsCount(c);
  return (
    <td width={200} valign="top" bgcolor="#CCCCFF" className={`sidebar ${className}`}>
      <div className="menu-header">メニュー</div>
      <MenuItem href="/">ホームページ</MenuItem>
      <MenuItem href="/accounts">リンク集</MenuItem>
      <MenuItem href="/products">プロダクト</MenuItem>
      <MenuItem href="https://suzuri.jp/tomomisun">オリジナルグッズ</MenuItem>
      <div className="counter">
        <div>訪問者数:</div>
        <div className="counter-number">{visitorsCount.padStart(8, '0')}</div>
        <div className="kiriban-notice">キリ番の人は掲示板にカキコして下さい！素通り禁止！！</div>
      </div>
    </td>
  )
}
