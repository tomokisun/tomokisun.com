import { createRoute } from 'honox/factory'
import AccountsPage from '../components/pages/AccountsPage'

export default createRoute(async (c) => {
  return c.render(
    <AccountsPage c={c} />,
    {
      title: 'アカウント一覧',
      description:
        'tomokisunのソーシャルメディアアカウント一覧。Twitter、Facebook、LinkedIn、Instagramなど。',
      ogUrl: 'https://tomokisun.com/accounts',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: 'tomokisunのアカウント一覧',
        url: 'https://tomokisun.com/accounts',
        mainEntity: {
          '@type': 'Person',
          name: 'tomokisun',
          sameAs: [
            'https://facebook.com/tomokisun',
            'https://linkedin.com/in/tomokisun',
            'https://instagram.com/tomokisun',
            'https://twitter.com/tomokisun',
            'https://t.me/tomokisun',
            'https://web.zepeto.me/tomokisun',
          ],
        },
      },
    }
  )
})
