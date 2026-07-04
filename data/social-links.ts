export type SocialLink = {
  platform: string
  url?: string
  display: string
  icon: string
}

export const socialLinks: SocialLink[] = [
  { platform: 'Email', url: 'mailto:tomoki69386@gmail.com', display: 'tomoki69386@gmail.com', icon: '✉️' },
  { platform: 'Facebook', url: 'https://facebook.com/tomokisun', display: 'tomokisun', icon: '👤' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/tomokisun', display: 'tomokisun', icon: '💼' },
  { platform: 'Instagram', url: 'https://instagram.com/tomokisun', display: 'tomokisun', icon: '📷' },
  { platform: 'Twitter', url: 'https://twitter.com/tomokisun', display: 'tomokisun', icon: '🐦' },
  { platform: 'Discord', display: 'tomokisun#1557', icon: '🎮' },
  { platform: 'Telegram', url: 'https://t.me/tomokisun', display: 'tomokisun', icon: '✈️' },
  { platform: 'Bondee', display: 'tomokisun', icon: '🏠' },
  { platform: 'ZEPETO', url: 'https://web.zepeto.me/tomokisun', display: 'tomokisun', icon: '🎭' },
]
