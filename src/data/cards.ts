export type CardData = {
  id: number
  name: string
  bio: string
  imageSrc: string
}

export const INITIAL_CARDS: CardData[] = [
  { id: 1, name: '伊藤 汰海', bio: '制作局副局長3年 20歳',      imageSrc: '/cards/self.jpg' },
  { id: 2, name: '誕生日', bio: '2005/10/12',            imageSrc: '/cards/birthday.png' },
  { id: 3, name: 'Mr.Children',    bio: '4月のライブが良すぎた',          imageSrc: '/cards/mrchildren.png' },
  { id: 4, name: 'スノボ',  bio: '今年は計5日間行きました',    imageSrc: '/cards/snowboard.png' },
  { id: 5, name: 'アプリ開発', bio: 'App Storeで「ツキイチ家計簿」って検索してみてね',  imageSrc: '/cards/app.png' },
  { id: 6, name: 'バイト', bio: '中高生にプログラミング教えてます', imageSrc: '/cards/job.png' },
]
