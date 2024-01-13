import { ADMIN_CHAT_ID, BOT_TOKEN } from '@/constants';
import logger from '@/utils/logger';
import { Telegraf } from 'telegraf';
import listCommand from './commands/list';
import listDirsCompose from './commands/listdirs';

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

bot.use(listCommand, listDirsCompose);

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
