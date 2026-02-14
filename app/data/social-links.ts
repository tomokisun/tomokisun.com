export type SocialLink = {
  platform: string
  url?: string
  display: string
}

export const socialLinks: SocialLink[] = [
  { platform: 'Email', url: 'mailto:tomoki69386@gmail.com', display: 'tomoki69386@gmail.com' },
  { platform: 'Facebook', url: 'https://facebook.com/tomokisun', display: 'tomokisun' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/tomokisun', display: 'tomokisun' },
  { platform: 'Instagram', url: 'https://instagram.com/tomokisun', display: 'tomokisun' },
  { platform: 'Twitter', url: 'https://twitter.com/tomokisun', display: 'tomokisun' },
  { platform: 'Discord', display: 'tomokisun#1557' },
  { platform: 'Telegram', url: 'https://t.me/tomokisun', display: 'tomokisun' },
  { platform: 'Bondee', display: 'tomokisun' },
  { platform: 'ZEPETO', url: 'https://web.zepeto.me/tomokisun', display: 'tomokisun' },
]
