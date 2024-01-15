import { ADMIN_CHAT_IDS } from '@/constants';
import logger from '@/utils/logger';
import { Context } from 'telegraf';
import { AsyncPredicate } from 'telegraf/typings/composer';

export function authGuard(): AsyncPredicate<Context> {
  return async function (ctx: Context): Promise<boolean> {
    if (!ctx.from?.id) return false;
    if (ADMIN_CHAT_IDS.includes(ctx.from.id)) return true;
    logger.info(`${ctx.from.id} 没有权限但还是勇猛的尝试了`);
    if (ctx?.callbackQuery) {
      ctx.reply('[权限不足] 这种事人家确实帮不上忙呢，可以找管理员试试哟～');
    }
    return false;
  };
}
