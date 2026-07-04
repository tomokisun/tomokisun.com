import { products } from '@/data/products'
import Window from '../Window'

const COLORS = ['melon', 'soda', 'cherry', 'lavender', 'cream', 'melon', 'soda'] as const

export default function ProductDetailWindows() {
  return (
    <>
      {products.map((product, index) => (
        <Window
          key={product.id}
          id={`p-${product.id}`}
          title={`${product.title}.app`}
          color={COLORS[index % COLORS.length]}
          statusBar={product.acquiredBy ? `所有者: ${product.acquiredBy}` : '所有者: tomokisun'}
        >
          <div className="app-detail">
            {product.acquiredBy && <div className="acq-stamp">ACQUIRED → {product.acquiredBy}</div>}
            <p>{product.description}</p>
            <p className="app-detail-actions">
              <a className="os-button" href={product.url} target="_blank" rel="noopener noreferrer">
                ひらく ↗
              </a>
            </p>
          </div>
        </Window>
      ))}
    </>
  )
}
