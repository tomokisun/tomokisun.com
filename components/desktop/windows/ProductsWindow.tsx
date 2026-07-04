import { products } from '@/data/products'
import Window from '../Window'

const TILES = ['cherry', 'melon', 'soda', 'cream', 'lavender', 'cherry', 'melon'] as const

export default function ProductsWindow() {
  const acquiredCount = products.filter((p) => p.acquiredBy).length
  return (
    <Window
      id="products"
      title="📁 Products"
      color="melon"
      statusBar={`${products.length} 項目 ｜ うち${acquiredCount}つは旅立ちました`}
    >
      <div className="folder-grid">
        {products.map((product, index) => (
          <a
            key={product.id}
            className="os-icon os-icon--folder"
            href={`#win-p-${product.id}`}
            data-open={`p-${product.id}`}
          >
            <span className={`os-icon-tile tile-${TILES[index % TILES.length]}`} aria-hidden="true">
              {product.acquiredBy ? '🔒' : product.icon}
            </span>
            <span className="os-icon-label">
              {product.title}.app
              {product.isNew && <span className="os-badge os-badge--new">NEW</span>}
              {product.acquiredBy && <span className="os-badge os-badge--acq">買収済</span>}
            </span>
          </a>
        ))}
      </div>
    </Window>
  )
}
