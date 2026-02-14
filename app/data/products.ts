export type Product = {
  id: string
  title: string
  description: string
  url: string
  isNew?: boolean
}

export const products: Product[] = [
  {
    id: 'newmatch',
    title: 'NewMatch',
    description:
      '新しい友だちが作れるアプリ「NewMatch」は、スワイプで気になる人を見つけ、お互いにLikeを送るとマッチし、メッセージで仲良くなり、同性の友だちもどんどん作れ、共通の趣味や行きたい場所、音楽を共有できるなど、色んな探し方で気の合う人を見つけ、毎日をもっと楽しくしてくれます！',
    url: 'https://newmatch.app',
    isNew: true,
  },
  {
    id: 'bematch',
    title: 'BeMatch',
    description:
      'BeRealを交換できる無料アプリです。繋がりたい人をスワイプで選ぶことができます。気になる人とマッチしてBeRealをもっと楽しもう！',
    url: 'https://bematch.jp',
  },
  {
    id: 'calculatormultiple',
    title: 'CalculatorMultiple',
    description: 'デバイスを横向きにすると、3つの計算機が表示されます。同時に複数の計算が必要な場合に使用できます。',
    url: 'https://apps.apple.com/ng/app/calculatormultiple/id1525626543',
  },
  {
    id: 'blackjack',
    title: 'Blackjack Counting',
    description: 'このアプリを使えば、誰でも簡単にブラックジャックのカウンティングができます！',
    url: 'https://apps.apple.com/ng/app/blackjack-counting/id1544949227',
  },
  {
    id: 'supernft',
    title: 'Super NFT Products (acq: GMO Pepabo, Inc.)',
    description: 'あなたが所有するオリジナルNFT商品を購入できるサービスです。',
    url: 'https://twitter.com/0xsnp',
  },
  {
    id: 'nererun',
    title: 'nererun',
    description: '子供たちの睡眠をサポートするために、寝かしつけに特化した読み聞かせサービスです。',
    url: 'https://nererunkids.studio.site/',
  },
  {
    id: 'pokerone',
    title: 'PokerONE (acq: deck, Inc.)',
    description: 'アミューズメントカジノのトーナメントを簡単に検索できるサービスです。',
    url: 'https://twitter.com/pokerone_jp',
  },
]
