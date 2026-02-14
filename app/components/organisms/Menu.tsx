import { Context } from 'hono'
import { Env } from 'hono'
import MenuItem from '../molecules/MenuItem'
import { getVisitorsCount } from '../../utils/visitors'

const menuItems = [
  { href: '/', label: 'ホームページ' },
  { href: '/accounts', label: 'リンク集' },
  { href: '/products', label: 'プロダクト' },
  { href: 'https://suzuri.jp/tomokisun', label: 'オリジナルグッズ' },
]

type MenuProps = {
  c: Context<Env, any, {}>
  className?: string
}

export default async function Menu({ c, className = '' }: MenuProps) {
  const visitorsCount = await getVisitorsCount(c);
  return (
    <td className={`align-top bg-[#CCCCFF] sidebar menu-cell ${className}`}>
      <div className="menu-header">メニュー</div>
      {menuItems.map((item) => (
        <MenuItem href={item.href}>{item.label}</MenuItem>
      ))}
      <div className="counter">
        <div>訪問者数:</div>
        <div className="counter-number">{visitorsCount.padStart(8, '0')}</div>
      </div>
    </td>
  )
}
