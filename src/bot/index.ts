import { BOT_TOKEN } from '@/constants';
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
bot.command('hipster', Telegraf.reply('λ'));

// Enable graceful stop
process.once('SIGINT', async () => {
  logger.info('SIGINT');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  logger.info('SIGTERM');
  bot.stop('SIGTERM');
});

export default bot;
