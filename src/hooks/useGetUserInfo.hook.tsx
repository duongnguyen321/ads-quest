import { useTelegram } from '@/hooks/useTelegram.hook';
import { getUser } from '@/services/user.services';

import type { ITelegramUser } from '@ts//telegram.types';
import type { User } from '@ts//user.types';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

function useGetUserInfo(_?: ITelegramUser['id'] | string) {
  const { user: userTelegram } = useTelegram();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const _userId = useMemo(() => {
    return _ ? _.toString() : userTelegram?.id;
  }, [_, userTelegram?.id]);

  const handleGetUser = useCallback(async () => {
    if (!_userId) return;
    setLoading(true);

    try {
      const _user = await getUser(_userId);
      setUser(_user);
    } catch (e) {
      console.error(e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [_userId]);

  useLayoutEffect(() => {
    if (!loading) return;
    handleGetUser().then();
  }, [loading, handleGetUser]);

  return {
    user,
    userTelegram,
    loading,
    refetch: () => setLoading(true),
  };
}

export default useGetUserInfo;
