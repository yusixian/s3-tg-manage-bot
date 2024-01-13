import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN ?? '';
export const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID ?? '';

export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
export const S3_ENDPOINT = process.env.S3_ENDPOINT || '';
export const S3_REGION = process.env.S3_REGION || '';

export const ITEMS_PER_PAGE = 10; // 每页显示的项目数
