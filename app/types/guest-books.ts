import { z } from "zod";
import { createInsertSchema } from 'drizzle-zod';
import { GuestBooks } from '../database/schema';

const insertGuestBookSchema = createInsertSchema(GuestBooks, {
  id: z.number(),
  username: z.string().min(3, "ユーザー名は3文字以上です").max(20, "ユーザー名は20文字以内です"),
  body: z.string().min(1, "内容は必須です").max(500, "内容は500文字以内です"),
});

export const createGuestBookSchema = insertGuestBookSchema.pick({
  username: true,
  body: true,
});

export type GuestbookEntity = {
  name: string
  date: string
  content: string
}
