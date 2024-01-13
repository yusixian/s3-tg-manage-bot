import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN ?? '';
export const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID ?? '';
