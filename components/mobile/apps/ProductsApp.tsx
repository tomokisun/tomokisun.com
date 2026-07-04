import { products } from '@/data/products'

export default function ProductsApp() {
  return (
    <div className="sp-products-list">
      {products.map((product) => (
        <a key={product.id} className="sp-product-item" href={product.url} target="_blank" rel="noopener noreferrer">
          <span className={`sp-product-icon tile-${product.color}`}>{product.icon}</span>
          <div className="sp-product-info">
            <div className="sp-product-name">
              {product.title}
              {product.isNew && <span className="os-badge os-badge--new">NEW</span>}
              {product.acquiredBy && <span className="os-badge os-badge--acq">買収済</span>}
            </div>
            <div className="sp-product-desc">{product.description.slice(0, 50)}...</div>
          </div>
          <span className="sp-product-arrow">→</span>
        </a>
      ))}
    </div>
  )
}
