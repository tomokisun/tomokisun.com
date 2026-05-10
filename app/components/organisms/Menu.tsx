import { menuItems } from '../../data/menu-items'
import MenuItem from '../molecules/MenuItem'

type MenuProps = {
  className?: string
}

export default function Menu({ className = '' }: MenuProps) {
  return (
    <aside className={`grid-sidebar ${className}`}>
      <div className="site-name-card">
        <div className="site-name">tomokisun</div>
        <div className="site-members">web ★ mobile ★ ios ★ engineer</div>
        <div className="site-deco">‥°・★─☆°・★─☆</div>
        <div className="site-tag">マヂで個人ホムペ</div>
      </div>
      <nav aria-label="メインメニュー">
        {menuItems.map((item) => (
          <MenuItem key={item.href} href={item.href}>
            {item.label}
          </MenuItem>
        ))}
      </nav>
      <div className="since-stamp">
        <div className="since-stamp-inner">~ SINCE 2006 ~</div>
      </div>
    </aside>
  )
}
