import { siteConfig } from '@/configs/site.configs';
import response, { type Response } from '@/helpers/backend.helpers';
import { initUser } from '@/services/user.services';
import { sendMessage } from '@/utils/telegram.server.utils';
import type { TelegramRoute } from '@ts//telegram.types';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest) {
  try {
    const body = (await req.json()) as TelegramRoute;
    console.log('body: ', body);
    const message = body?.message || body?.my_chat_member;
    const userId = message?.from?.id || message?.chat?.id;
    const username = message?.from.username || message?.chat?.username;
    const isPremium =
      message?.from?.is_premium || message?.chat?.is_premium || false;

    if (message && userId && username) {
      await initUser({
        telegramId: userId.toString(),
        username: username || userId.toString(),
        isPremium: isPremium,
      });
    }
    if (message?.text?.startsWith?.(`/start`)) {
      await sendMessage(
        userId,
        `Hello, welcome ${
          username ? `@${username}` : userId ? `@${userId}` : 'my friend'
        }, hope you play ${siteConfig.name} fun!`,
      );
    }
    return response({
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return response({
      status: 500,
      errors: e as Response['errors'],
    });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
