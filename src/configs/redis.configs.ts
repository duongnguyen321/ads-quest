import { isMongoId } from '@/helpers/string.helpers';

export const REDIS_KEYS = {
	user: {
		id:'user-id',
		telegramId : 'user-telegram',
		address: 'user-address'
	}
}


export const k_userTelegram =  (uid: string | number) =>
	`${REDIS_KEYS.user[isMongoId(uid) ? 'id' : 'telegramId']}:${uid}`;
export const k_userAddress = (address: string) =>
	`${REDIS_KEYS.user['address']}:${address}`;
