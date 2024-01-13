import { ADMIN_CHAT_ID, BOT_TOKEN } from '@/constants';
import logger from '@/utils/logger';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(BOT_TOKEN);

//? [用户] /start
//? [bot] Welcome!
bot.start((ctx) => ctx.reply('Welcome!'));

//? [用户] /help
//? [bot] Send me a command
bot.help((ctx) => ctx.reply('Send me a command'));

// 其他 bot 命令...
bot.command('test', (ctx) => ctx.reply('喜欢你！'));

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
