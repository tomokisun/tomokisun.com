import { createRoute } from 'honox/factory'
import HomePage from '../components/pages/HomePage'
import { incrementVisitorsCount } from '../utils/visitors'
import { drizzle } from 'drizzle-orm/d1';
import { GuestBooks } from '../database/schema';
import { zValidator } from '@hono/zod-validator';
import { createGuestBookSchema, transformGuestBookEntity } from '../types/guest-books';
import { desc } from 'drizzle-orm';
import { generateCaptcha, generateSessionId, storeCaptchaSession, verifyCaptcha } from '../utils/captcha';
import { checkRateLimit, getClientIP } from '../utils/rate-limit';
import { isSpamContent, containsForbiddenWords } from '../utils/spam-filter';

export const POST = createRoute(async (c) => {
  const formData = await c.req.formData();
  const username = formData.get('username') as string;
  const body = formData.get('body') as string;
  const captcha = formData.get('captcha') as string;
  const sessionId = formData.get('sessionId') as string;
  const honeypot = formData.get('email') as string; // ハニーポット

  // ハニーポットチェック（botは通常このフィールドを埋める）
  if (honeypot) {
    return c.redirect('/?error=invalid');
  }

  // 基本的なバリデーション
  const validationResult = createGuestBookSchema.safeParse({ username, body });
  if (!validationResult.success) {
    return c.redirect('/?error=validation');
  }

  // CAPTCHAの検証
  const captchaValid = await verifyCaptcha(c, sessionId, captcha);
  if (!captchaValid) {
    return c.redirect('/?error=captcha');
  }

  // レート制限チェック
  const clientIP = getClientIP(c);
  const rateLimit = await checkRateLimit(c, clientIP);
  if (!rateLimit.allowed) {
    return c.redirect(`/?error=rate_limit&retry_after=${rateLimit.retryAfter}`);
  }

  // スパムコンテンツチェック
  const combinedContent = `${username} ${body}`;
  if (isSpamContent(combinedContent)) {
    return c.redirect('/?error=spam');
  }

  // 禁止ワードチェック
  if (containsForbiddenWords(combinedContent)) {
    return c.redirect('/?error=forbidden');
  }

  // データベースに保存
  const db = drizzle(c.env.DB);
  await db.insert(GuestBooks).values({ username, body }).returning().get();
  
  return c.redirect('/?success=posted');
});

export default createRoute(async (c) => {
  await incrementVisitorsCount(c);

  // CAPTCHAの生成
  const captcha = generateCaptcha();
  const sessionId = generateSessionId();
  await storeCaptchaSession(c, sessionId, captcha.answer);

  const db = drizzle(c.env.DB);
  const res = await db.select().from(GuestBooks).orderBy(desc(GuestBooks.createdAt)).limit(20);
  const guestBooks = res.map(transformGuestBookEntity);
  
  return c.render(
    <HomePage 
      c={c} 
      guestBooks={guestBooks} 
      captchaQuestion={captcha.question}
      sessionId={sessionId}
    />
  )
})
