// スパムコンテンツのフィルタリング
export function isSpamContent(content: string): boolean {
  const lowerContent = content.toLowerCase()
  
  // スパムキーワード
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'poker', 'lottery',
    'click here', 'buy now', 'limited offer', 'act now',
    'congratulations', 'you won', 'winner', 'prize',
    'bitcoin', 'crypto', 'investment opportunity',
    'weight loss', 'diet pills', 'lose weight fast',
    'work from home', 'make money online', 'earn cash',
    'free money', 'get rich', 'millionaire',
    'hot singles', 'adult', 'dating',
    'miracle', 'cure', 'cheap meds',
    'loan', 'credit', 'debt relief',
    'refinance', 'mortgage',
    // 日本語のスパムキーワード
    '副業', '稼げる', '儲かる', '必勝法',
    '出会い系', 'セフレ', '援交',
    'パチンコ', 'スロット', '競馬',
    '詐欺', 'ネズミ講', 'マルチ商法',
    '無料', '激安', '格安', '最安値',
    'ダイエット', '痩せる', '美容',
    '借金', '融資', 'キャッシング',
    'クレジットカード現金化'
  ]
  
  // スパムキーワードのチェック
  for (const keyword of spamKeywords) {
    if (lowerContent.includes(keyword)) {
      return true
    }
  }
  
  // 過度なURL数のチェック（3つ以上）
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const urls = content.match(urlPattern) || []
  if (urls.length >= 3) {
    return true
  }
  
  // 電話番号パターンのチェック（複数）
  const phonePattern = /(\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{3,4})/g
  const phones = content.match(phonePattern) || []
  if (phones.length >= 2) {
    return true
  }
  
  // メールアドレスの過度な使用（2つ以上）
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
  const emails = content.match(emailPattern) || []
  if (emails.length >= 2) {
    return true
  }
  
  // 同じ文字の繰り返し（スパムの特徴）
  const repeatPattern = /(.)\1{9,}/
  if (repeatPattern.test(content)) {
    return true
  }
  
  // 大文字の過度な使用（全体の50%以上）
  const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length
  if (upperCaseRatio > 0.5 && content.length > 20) {
    return true
  }
  
  return false
}

// 禁止ワードのチェック
export function containsForbiddenWords(content: string): boolean {
  const lowerContent = content.toLowerCase()
  
  // 不適切な言葉
  const forbiddenWords = [
    // 暴力的な表現
    'kill', 'murder', 'suicide',
    '殺', '死ね', '自殺',
    // 差別的な表現
    'nigger', 'chink', 'gook',
    // その他不適切な表現
    'fuck', 'shit', 'bitch',
    'ファック', 'クソ'
  ]
  
  for (const word of forbiddenWords) {
    if (lowerContent.includes(word)) {
      return true
    }
  }
  
  return false
}