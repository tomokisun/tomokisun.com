import type { AppContext } from '../../global'
import { menuItems } from '../../data/menu-items'
import MenuItem from '../molecules/MenuItem'
import { getVisitorsCount } from '../../utils/visitors'

type MenuProps = {
  c: AppContext
  className?: string
}

export default async function Menu({ c, className = '' }: MenuProps) {
  const visitorsCount = await getVisitorsCount(c);
  return (
    <aside className={`grid-sidebar sidebar ${className}`}>
      <div className="menu-header">メニュー</div>
      <nav aria-label="メインメニュー">
        {menuItems.map((item) => (
          <MenuItem key={item.href} href={item.href}>{item.label}</MenuItem>
        ))}
      </nav>
      <div className="counter">
        <div>訪問者数:</div>
        <div className="counter-number">{visitorsCount.padStart(8, '0')}</div>
      </div>
    </aside>
  )
}
