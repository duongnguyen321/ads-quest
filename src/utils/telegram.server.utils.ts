'use server';

import { CLIENT_URL } from '@/configs/site.configs';

export async function initWebhook() {
  // Remember, it must be a https
  await fetch(
    `https://api.telegram.org/bot${process.env.BOT_API_KEY}/setWebhook?url=${CLIENT_URL}/telegram`,
  );
}

export async function sendMessage(
  userId: string | number | undefined,
  text: string,
) {
  if (!userId || !text) return;
  try {
    const botAPIKey = process.env.BOT_API_KEY;
    return await fetch(
      `https://api.telegram.org/bot${botAPIKey}/sendMessage?chat_id=${userId}&text=${text}&parse_mode=HTML`,
    );
  } catch (e) {
    console.error('Error when send message: ', e);
  }
}
