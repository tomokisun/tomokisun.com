import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'
import { incrementVisitorsCount } from '../utils/visitors'

export default createRoute(async (c) => {
  await incrementVisitorsCount(c)

  return c.render(
    <HomePage c={c} />,
    {
      description:
        'tomokisunの個人ホームページ。iOS・モバイル・ウェブエンジニアとしての自己紹介と職歴。',
      ogUrl: 'https://tomokisun.com/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'tomokisun',
        jobTitle: 'Software Engineer',
        url: 'https://tomokisun.com',
        sameAs: [
          'https://facebook.com/tomokisun',
          'https://linkedin.com/in/tomokisun',
          'https://instagram.com/tomokisun',
          'https://twitter.com/tomokisun',
          'https://t.me/tomokisun',
          'https://web.zepeto.me/tomokisun',
          'https://github.com/tomokisun',
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'ONE, Inc.',
        },
      },
    }
  )
})
