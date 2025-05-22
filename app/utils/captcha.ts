import { Context } from 'hono'
import { Env } from 'hono'

type CaptchaQuestion = {
  question: string
  answer: number
}

// 90年代風のシンプルな数学問題を生成
export function generateCaptcha(): CaptchaQuestion {
  const operations = [
    () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { question: `${a} + ${b} = ?`, answer: a + b }
    },
    () => {
      const a = Math.floor(Math.random() * 10) + 11
      const b = Math.floor(Math.random() * 10) + 1
      return { question: `${a} - ${b} = ?`, answer: a - b }
    },
    () => {
      const a = Math.floor(Math.random() * 5) + 1
      const b = Math.floor(Math.random() * 5) + 1
      return { question: `${a} × ${b} = ?`, answer: a * b }
    },
  ]
  
  const operation = operations[Math.floor(Math.random() * operations.length)]
  return operation()
}

// CAPTCHAセッションを保存（15分間有効）
export async function storeCaptchaSession(
  c: Context<Env, any, {}>,
  sessionId: string,
  answer: number
): Promise<void> {
  const captchaKV = c.env.CAPTCHA as KVNamespace
  await captchaKV.put(
    `captcha:${sessionId}`,
    JSON.stringify({ answer, timestamp: Date.now() }),
    { expirationTtl: 900 } // 15分
  )
}

// CAPTCHAの検証
export async function verifyCaptcha(
  c: Context<Env, any, {}>,
  sessionId: string,
  userAnswer: string
): Promise<boolean> {
  const captchaKV = c.env.CAPTCHA as KVNamespace
  const sessionData = await captchaKV.get(`captcha:${sessionId}`)
  
  if (!sessionData) {
    return false
  }
  
  const { answer } = JSON.parse(sessionData)
  const userAnswerNum = parseInt(userAnswer, 10)
  
  // 使用済みにする
  await captchaKV.delete(`captcha:${sessionId}`)
  
  return answer === userAnswerNum
}

// セッションIDを生成
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}