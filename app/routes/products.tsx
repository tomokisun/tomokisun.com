import { createRoute } from 'honox/factory'
import ProductsPage from '../components/pages/ProductsPage'

export default createRoute(async (c) => {
  return c.render(<ProductsPage c={c} />, {
    title: 'プロダクト一覧',
    description: 'tomokisunが開発したプロダクト一覧。NewMatch、BeMatch、CalculatorMultipleなどのアプリを紹介。',
    ogUrl: 'https://tomokisun.com/products',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'tomokisunのプロダクト一覧',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'SoftwareApplication',
            name: 'NewMatch',
            url: 'https://newmatch.app',
            applicationCategory: 'SocialNetworkingApplication',
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'SoftwareApplication',
            name: 'BeMatch',
            url: 'https://bematch.jp',
            applicationCategory: 'SocialNetworkingApplication',
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'SoftwareApplication',
            name: 'CalculatorMultiple',
            url: 'https://apps.apple.com/ng/app/calculatormultiple/id1525626543',
            applicationCategory: 'UtilitiesApplication',
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'SoftwareApplication',
            name: 'Blackjack Counting',
            url: 'https://apps.apple.com/ng/app/blackjack-counting/id1544949227',
            applicationCategory: 'GameApplication',
          },
        },
        {
          '@type': 'ListItem',
          position: 5,
          item: {
            '@type': 'SoftwareApplication',
            name: 'Super NFT Products',
            url: 'https://twitter.com/0xsnp',
          },
        },
        {
          '@type': 'ListItem',
          position: 6,
          item: {
            '@type': 'SoftwareApplication',
            name: 'nererun',
            url: 'https://nererunkids.studio.site/',
            applicationCategory: 'LifestyleApplication',
          },
        },
        {
          '@type': 'ListItem',
          position: 7,
          item: {
            '@type': 'SoftwareApplication',
            name: 'PokerONE',
            url: 'https://twitter.com/pokerone_jp',
            applicationCategory: 'EntertainmentApplication',
          },
        },
      ],
    },
  })
})
