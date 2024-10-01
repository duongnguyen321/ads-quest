import type { INIT_USER } from '@/configs/init.configs';

export interface User {
	id: string;
	username: string;
	level: number;
	telegramId: string;
	isPremium: boolean;
	points: number;
	coinBalance: number;
	walletAddress: string | null;
	isUnlock: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type DefaultUser = typeof INIT_USER
