export interface SiteConfig {
  name: string;
  description: string;

  [key: string]: unknown;
}

export const siteConfig: SiteConfig = {
  name: 'Xem ads',
  description: 'Xem ads và nhận thưởng bằng tiền điện tử.',
};

export const CLIENT_URL = process.env.CLIENT_URL;
export const SERVER_URL = process.env.SERVER_URL;
export const TELEGRAM_URL = process.env.TELEGRAM_URL;
export const SERVER_URI = `${SERVER_URL}/api`;
