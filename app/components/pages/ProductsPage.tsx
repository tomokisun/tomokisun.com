import { products } from '../../data/products'
import type { AppContext } from '../../global'
import Blink from '../atoms/Blink'
import Link from '../atoms/Link'
import Text from '../atoms/Text'
import Section from '../organisms/Section'
import PageLayout from '../templates/PageLayout'

type ProductsPageProps = {
  c: AppContext
}

export default function ProductsPage({ c }: ProductsPageProps) {
  return (
    <PageLayout c={c} title="tomokisunのプロダクト一覧">
      {products.map((product) => (
        <Section
          key={product.id}
          id={product.id}
          title={
            product.isNew ? (
              <>
                {product.title}
                <Blink className="new-marker">NEW!</Blink>
              </>
            ) : (
              product.title
            )
          }
        >
          <Text>{product.description}</Text>
          <Text>
            <Link href={product.url} target="_blank">
              {product.url}
            </Link>
          </Text>
        </Section>
      ))}
    </PageLayout>
  )
}
