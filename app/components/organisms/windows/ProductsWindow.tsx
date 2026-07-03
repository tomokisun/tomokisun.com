import { products } from '../../../data/products'
import Window from '../Window'

const TILES = ['pink', 'mint', 'yellow', 'blue', 'purple', 'pink', 'mint'] as const

type ProductsWindowProps = {
  open?: boolean
}

export default function ProductsWindow({ open = false }: ProductsWindowProps) {
  const acquiredCount = products.filter((p) => p.acquiredBy).length
  return (
    <Window
      id="products"
      title="📁 products"
      color="yellow"
      open={open}
      statusBar={`${products.length} 項目（うち買収済み ${acquiredCount}）`}
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
              {product.acquiredBy ? '🔒' : '📦'}
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
