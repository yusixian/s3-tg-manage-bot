import { ADMIN_CHAT_ID, BOT_TOKEN, S3_BUCKET_NAME } from '@/constants';
import { getLinkableFileList } from '@/utils/bot';
import logger from '@/utils/logger';
import s3 from '@/utils/s3';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Markup, Telegraf } from 'telegraf';

const bot = new Telegraf(BOT_TOKEN);

//? [用户] /start
bot.start((ctx) => ctx.reply('欢迎，请尽情的享受咱吧～\n输入 /help 查看帮助哦'));

//? [用户] /help
//? [bot] 列出帮助
bot.help((ctx) =>
  ctx.reply(
    '命令列表：\n' +
      '/start - 显示欢迎信息\n' +
      '/list [prefix] [limit] - 列出文件，可指定前缀和限制数量\n' +
      '/listdirs - 列出所有顶级目录\n' +
      '/upload - 上传文件（暂未实现）\n' +
      '/download - 下载文件（暂未实现）\n' +
      '/delete - 删除文件（暂未实现）',
  ),
);

// List 命令
bot.command('list', async (ctx) => {
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

// 生成内联键盘
function generateInlineKeyboard(dirList, parentDir) {
  const buttons = dirList.map((dir) => Markup.button.callback(dir, `listdir_${dir}`));

  // 如果有parentDir，则添加一个“Back”按钮
  if (parentDir) {
    buttons.push(Markup.button.callback('Back', `back_${parentDir}`));
  }

  return Markup.inlineKeyboard(buttons);
}
// ListDirs 命令
bot.command('listdirs', async (ctx) => {
  try {
    const args = ctx.message.text.split(' ').slice(1);
    const prefix = args?.[0]; // 默认无前缀
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME,
      Delimiter: '/',
      Prefix: prefix && !prefix?.endsWith('/') ? `${prefix}/` : prefix,
    });
    const s3Response = await s3.send(listObjectsCommand);

    if (!s3Response?.CommonPrefixes?.length) {
      ctx.reply('没有找到目录');
    } else {
      // 生成内联键盘
      const keyboard = Markup.inlineKeyboard(
        s3Response.CommonPrefixes.map((item) => Markup.button.callback(item?.Prefix ?? '', `listdir_${item.Prefix}`)),
      );
      logger.info(keyboard);

      ctx.replyWithHTML(`目录列表:`, keyboard);
    }
    // const dirList = s3Response.CommonPrefixes.map((prefix) => prefix.Prefix).join('\n');
    // ctx.reply(`目录列表:\n${dirList}`);
    // }
  } catch (error) {
    console.error(error);
    ctx.reply('无法获取目录列表');
  }
});

// 处理内联键盘上的按钮点击
bot.action(/^listdir_(.+)/, async (ctx) => {
  const prefix = ctx.match[1];
  logger.info(prefix);
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: prefix && !prefix?.endsWith('/') ? `${prefix}/` : prefix,
  });
  try {
    const s3Response = await s3.send(listObjectsCommand);
    if (!s3Response?.CommonPrefixes?.length) {
      ctx.reply('没有找到更多目录');
    } else {
      const dirList = s3Response.CommonPrefixes.map((item) => item?.Prefix ?? '');
      const keyboard = Markup.inlineKeyboard(dirList.map((dir) => Markup.button.callback(dir, `listdir_${dir}`)));
      ctx.reply(`目录列表:\n${dirList.join('\n')}`, keyboard);
    }
  } catch (error) {
    console.error(error);
    ctx.reply('无法获取目录列表');
  }
});
// 设置命令
bot.telegram.setMyCommands([
  { command: 'start', description: '显示欢迎信息～' },
  { command: 'help', description: '显示帮助～' },
  { command: 'list', description: '/list [prefix] [limit] - 列出文件，可指定前缀和限制数量' },
  { command: 'listdirs', description: '/listDirs [dir] - 列出该目录下所有目录，默认为顶层目录' },
  { command: 'upload', description: '上传文件（暂未实现）' },
  { command: 'download', description: '下载文件（暂未实现）' },
  { command: 'delete', description: '删除文件（暂未实现）' },
]);

// Enable graceful stop
process.once('SIGINT', () => {
  logger.info('[SIGINT] 呜呜呜人家要被杀掉惹...');
  bot.telegram.sendMessage(ADMIN_CHAT_ID, '[SIGINT] 呜呜呜人家要被杀掉惹...');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  logger.info('[SIGTERM] 呜呜呜人家要被杀掉惹...');
  bot.telegram.sendMessage(ADMIN_CHAT_ID, '[SIGTERM] 呜呜呜人家要被杀掉惹...');
  bot.stop('SIGTERM');
});

export default bot;
