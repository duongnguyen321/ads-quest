import { useTelegram } from '@/hooks/useTelegram.hook';
import { getUser, initUser } from '@/services/user.services';
import useUserStore from '@/store/user.store';
import type { DefaultUser, User } from '@ts//user.types';
import { useCallback, useMemo } from 'react';

export default function useInitUser() {
  const { user } = useTelegram();
  const { setUserInfo } = useUserStore();

  const initDataUser = useMemo(() => ({
    telegramId: user?.id,
    username: user?.username,
    isPremium: !!user?.is_premium,
  }), [user]);

  return useCallback(async () => {
    let fetchedUser: User | null;
    if (process.env.NODE_ENV !== 'development') {
      fetchedUser = await initUser(initDataUser as unknown as DefaultUser);
    } else {
      fetchedUser = await getUser(process.env.DEV_USER_ID as string);
    }
    if (fetchedUser) {
      setUserInfo(fetchedUser);
    }
  }, [initDataUser, setUserInfo]);
};
