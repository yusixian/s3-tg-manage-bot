import { ADMIN_CHAT_IDS, BOT_TOKEN } from '@/constants';
import logger from '@/utils/logger';
import { Telegraf } from 'telegraf';
import listCommand from './commands/list';
import listDirsCompose from './commands/listdirs';
import { authGuard } from './guards/authGuard';

const bot = new Telegraf(BOT_TOKEN);

//? [用户] /start
bot.start((ctx) => ctx.reply('欢迎，请尽情的享受咱吧～\n输入 /help 查看帮助哦'));

//? [用户] /help
//? [bot] 列出帮助
bot.help((ctx) =>
  ctx.reply(
    '命令列表：\n' +
      '/start - 显示欢迎信息\n' +
      '/list [prefix] [limit] - (admin) 列出文件，可指定目录前缀和限制数量\n' +
      '/listdirs [dir] - (admin) 列出该目录下所有目录，默认为顶层目录\n' +
      '/upload - 上传文件（暂未实现）\n' +
      '/download - 下载文件（暂未实现）\n' +
      '/delete - 删除文件（暂未实现）',
  ),
);

bot.use(Telegraf.optional(authGuard(), listCommand));
bot.use(Telegraf.optional(authGuard(), listDirsCompose));

// 设置命令
bot.telegram.setMyCommands([
  { command: 'start', description: '显示欢迎信息～' },
  { command: 'help', description: '显示帮助～' },
  { command: 'list', description: '/list [prefix] [limit] - (admin) 列出文件，可指定目录前缀和限制数量' },
  { command: 'listdirs', description: '/listdirs [dir] - (admin) 列出该目录下所有目录，默认为顶层目录' },
  { command: 'upload', description: '(admin) 上传文件（暂未实现）' },
  { command: 'download', description: '(admin) 下载文件（暂未实现）' },
  { command: 'delete', description: '(admin) 删除文件（暂未实现）' },
]);

// Enable graceful stop
process.once('SIGINT', () => {
  logger.info('[SIGINT] 呜呜呜人家要被杀掉惹...');
  ADMIN_CHAT_IDS?.length &&
    ADMIN_CHAT_IDS.forEach((adminId) => {
      bot.telegram.sendMessage(adminId, '[SIGINT] 呜呜呜人家要被杀掉惹...');
    });
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  logger.info('[SIGTERM] 呜呜呜人家要被杀掉惹...');
  ADMIN_CHAT_IDS?.length &&
    ADMIN_CHAT_IDS.forEach((adminId) => {
      bot.telegram.sendMessage(adminId, '[SIGTERM] 呜呜呜人家要被杀掉惹...');
    });
  bot.stop('SIGTERM');
});

export default bot;
