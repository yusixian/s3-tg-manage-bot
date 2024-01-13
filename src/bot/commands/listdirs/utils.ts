import { InlineKeyboardButton, InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

// 生成内联键盘
export function generateInlineKeyboard(dirList: string[], parentDir: string | null): InlineKeyboardMarkup {
  const buttons = dirList?.length
    ? dirList.map((dir) => [{ text: dir, callback_data: `list-item-click_${dir}` } as InlineKeyboardButton])
    : [];

  // 如果有parentDir，则添加一个“Back”按钮
  if (parentDir) {
    buttons.push([{ text: 'Back', callback_data: `list-item-back_${parentDir}` }]);
  }

  return { inline_keyboard: buttons };
}

// 获取父目录
export function getParentDir(dir: string | null): string | null {
  if (!dir || dir === '/') return null; // 根目录的父目录为空
  const path = !dir.endsWith('/') ? `${dir}/` : dir;
  const parts = path.split('/').filter(Boolean);
  parts.pop(); // 移除最后一个元素
  return parts.join('/') + '/';
}
