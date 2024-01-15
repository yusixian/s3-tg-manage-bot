import { S3_BUCKET_NAME } from '@/constants';
import s3 from '@/utils/s3';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Telegraf } from 'telegraf';
import { listItemAction, listItemBackAction } from './actions';
import { generateInlineKeyboard, getParentDir } from './utils';

/**
 * /listdirs [dir] - (admin) 列出该目录下所有目录，默认为顶层目录
 */
const listDirsCommand = Telegraf.command('listdirs', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const prefix = args?.[0] || '/'; // 默认无前缀
  const parentDir = getParentDir(prefix);
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: prefix === '/' ? undefined : prefix,
  });

  try {
    const s3Response = await s3.send(listObjectsCommand);
    if (!s3Response?.CommonPrefixes?.length) {
      ctx.reply('没有找到目录');
    } else {
      const dirList = s3Response.CommonPrefixes.map((item) => item.Prefix ?? '');
      const keyboard = generateInlineKeyboard(dirList, parentDir);
      ctx.reply('目录列表:', { reply_markup: keyboard });
    }
  } catch (error) {
    console.error(error);
    ctx.reply('无法获取目录列表');
  }
});
const listDirsCompose = Telegraf.compose([listDirsCommand, listItemAction, listItemBackAction]);
export default listDirsCompose;
