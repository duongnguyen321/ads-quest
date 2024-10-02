'use server';

import { k_userAddress, k_userTelegram } from '@/configs/redis.configs';
import { INIT_AMOUNT_UNLOCK } from '@/configs/ton.configs';
import { cloneObj } from '@/helpers/object.helpers';
import { isMongoId } from '@/helpers/string.helpers';
import prisma from '@/lib/prisma.lib';
import redis from '@/lib/redis.lib';
import { removeCache } from '@/services/cached.services';
import { $Enums } from '@prisma/client';
import type { DefaultUser, User } from '@ts//user.types';

export async function getUser(userId?: string | number) {
  if (!userId) {
    if (process.env.NODE_ENV === 'development') {
      userId = process.env.DEV_USER_ID as string;
    } else return null;
  }
  let whereClause: { [key: string]: string } = {
    telegramId: userId?.toString(),
  };
  if (isMongoId(userId)) {
    whereClause = {
      id: userId?.toString(),
    };
  }
  return await redis.cached<User | null>(k_userTelegram(userId), () =>
    prisma.user.findFirst({
      where: whereClause,
    }),
  );
}

export async function createUser(user: DefaultUser): Promise<User | null> {
  try {
    const data = await redis.cached(k_userTelegram(user.telegramId), () =>
      prisma.user.create({
        data: user,
      }),
    );
    return data as User;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateUser(user: Omit<User, 'id'> | DefaultUser): Promise<User | null> {
  try {
    await removeCache(k_userTelegram(user.telegramId));
    console.info(`Update user ${user.telegramId} to cache`);
    return await redis.cached<User | null>(k_userTelegram(user.telegramId), () => prisma.user.update({
      where: {
        telegramId: user.telegramId,
      },
      data: user,
    }));
  } catch (e) {
    console.error(e);
    return null;
  }
}


export async function removeAddressUser(userId: User['id'] | User['telegramId'] | null): Promise<User | null> {
  if (!userId) return null;
  try {
    const isMongoUserId = isMongoId(userId);

    const whereClause = isMongoUserId ? { id: userId.toString() } : { telegramId: userId.toString() };
    removeCache(k_userTelegram(userId));
    await removeCache(k_userAddress(userId));

    return await redis.cached(k_userTelegram(userId), () => prisma.user.update({
      where: whereClause,
      data: { walletAddress: null },
    }));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function addAddressUser(userId: User['id'] | User['telegramId'], walletAddress: User['walletAddress']): Promise<User | null> {
  if (!walletAddress) return null;

  const walletExisting = await redis.cached<User | null>(k_userAddress(walletAddress), () =>
    prisma.user.findFirst({
      where: {
        walletAddress,
      },
    }));

  const isMongoUserId = isMongoId(userId);
  if (walletExisting && (isMongoUserId ? walletExisting.id !== userId : walletExisting.telegramId !== userId)) {
    throw new Error('Wallet address already exists for another user') ;
  }

  const whereClause = isMongoUserId ? { id: userId.toString() } : { telegramId: userId.toString() };

  const userUpdated = await prisma.user.update({
    where: whereClause,
    data: { walletAddress },
  });

  redis.set(k_userAddress(walletAddress), JSON.stringify(userUpdated));
  redis.set(k_userTelegram(userId), JSON.stringify(userUpdated));

  return userUpdated;
}


export async function initUser(user: DefaultUser): Promise<User | null> {
  if (!user.telegramId || !user.username) return null;
  try {
    const userExisting = await getUser(user?.telegramId?.toString());
    if (!userExisting) {
      console.info('User does not exist');
      return await createUser(user);
    } else {
      console.info('User already exist');
      if (
        userExisting.username !== user.username ||
        userExisting.isPremium !== user.isPremium
      ) {
        console.info('Update user info');
        return await updateUser(user);
      }
      return userExisting as User;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createUserTransactions(telegramId: User['telegramId'], body: {
  amount: number;
  currencyType: $Enums.CurrencyType;
  transactionType: $Enums.TransactionType;
  hash?: string
}) {
  return prisma.transaction.create({
    data: {
      telegramId,
      ...body,
    },
  });
}

export async function unlockUser(userId: User['id'] | User['telegramId'] | null, hash?: string): Promise<User | null> {
  if (!userId) return null;
  const user = await getUser(userId);
  if (!user || !user.walletAddress) return null;
  if (user.isUnlock) return user;
  const updatedUserData = cloneObj<User>({
    ...user,
    isUnlock: true,
  });
  if (!updatedUserData) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...userData } = updatedUserData;
  const userUpdated = await updateUser(userData);
  if (!userUpdated) return null;
  createUserTransactions(userUpdated.telegramId, {
    amount: INIT_AMOUNT_UNLOCK,
    currencyType: 'COIN',
    transactionType: 'SPEND',
    hash,
  }).then(() => console.info(`User ${userUpdated.username} has unlocked!`));
  return userUpdated;
}
