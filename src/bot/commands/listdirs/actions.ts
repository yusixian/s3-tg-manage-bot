import { Telegraf } from 'telegraf';
import { generateInlineKeyboard, getParentDir } from './utils';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { S3_BUCKET_NAME } from '@/constants';
import s3 from '@/utils/s3';

// 处理目录按钮点击
export const listItemAction = Telegraf.action(/^list-item-click_(.+)/, async (ctx) => {
  const selectedDir = ctx.match[1];
  const parentDir = getParentDir(selectedDir);

  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: selectedDir === '/' ? undefined : selectedDir,
  });

  try {
    const s3Response = await s3.send(listObjectsCommand);

    if (!s3Response?.CommonPrefixes?.length) {
      const keyboard = generateInlineKeyboard([], parentDir);
      ctx.editMessageText(`目录列表:\n${selectedDir}\n当前目录下没有目录了`, { reply_markup: keyboard });
    } else {
      const dirList = s3Response.CommonPrefixes.map((item) => item.Prefix ?? '');
      const keyboard = generateInlineKeyboard(dirList, parentDir);
      ctx.editMessageText(`目录列表:\n${selectedDir}`, { reply_markup: keyboard });
    }
  } catch (error) {
    console.error(error);
    ctx.reply('无法获取目录列表');
  }
});

// 处理“Back”按钮点击
export const listItemBackAction = Telegraf.action(/^list-item-back_(.+)/, async (ctx) => {
  const parentDir = ctx.match[1];
  const grandParentDir = getParentDir(parentDir) ?? '';

  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: parentDir === '/' ? undefined : parentDir,
  });

  try {
    const s3Response = await s3.send(listObjectsCommand);
    if (!s3Response?.CommonPrefixes?.length) {
      ctx.reply('没有找到目录');
    } else {
      const dirList = s3Response.CommonPrefixes.map((item) => item.Prefix ?? '');
      const keyboard = generateInlineKeyboard(dirList, grandParentDir);
      ctx.editMessageText(`目录列表:\n${parentDir}`, { reply_markup: keyboard });
    }
  } catch (error) {
    console.error(error);
    ctx.reply('无法获取目录列表');
  }
});
