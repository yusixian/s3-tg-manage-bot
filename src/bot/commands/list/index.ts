import { S3_BUCKET_NAME } from '@/constants';
import { getLinkableFileList } from '@/utils/bot';
import s3 from '@/utils/s3';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Telegraf } from 'telegraf';

/**
 * /list [prefix] [limit] - 列出文件，可指定前缀和限制数量
 */
const listCommand = Telegraf.command('list', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const prefix = args[0] || ''; // 默认无前缀
  const limit = args[1] ? parseInt(args[1], 10) : 10; // 默认限制为10

  try {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: limit,
    });
    const s3Response = await s3.send(listObjectsCommand);

    if (!s3Response?.Contents?.length) {
      ctx.reply('没有找到文件');
    } else {
      const fileList = getLinkableFileList(s3Response.Contents.map((obj) => obj.Key ?? ''));
      ctx.reply(`文件列表:\n${fileList}`, { parse_mode: 'HTML' });
    }
  } catch (error) {
    console.error(error);
    ctx.reply('无法获取文件列表');
  }
});
export default listCommand;
