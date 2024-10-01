'use client';

import Loading from '@/components/core/Loading';
import useInitUser from '@/hooks/useInitUser.hook';
import { useTelegram } from '@/hooks/useTelegram.hook';
import useUserStore from '@/store/user.store';
import { useLayoutEffect } from 'react';


function AuthProvider({ children }: { children: React.ReactNode }) {
  const {webApp} = useTelegram()
  const { loading, setLoading } = useUserStore();
  const fetchUser = useInitUser();

  useLayoutEffect(() => {
    fetchUser().finally(() => {
      webApp?.ready();
      setLoading(false);
    });
  }, [fetchUser, setLoading, webApp]);
  
  useLayoutEffect(() => {
    if (
      process.env.NODE_ENV !== 'development' &&
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      navigator.userAgent
    ) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const disableDevtool = require('disable-devtool');
      disableDevtool();
    }
  }, []);

  if (loading) {
    return <Loading className="fixed inset-0" />;
  }

  return <>{children}</>;
}

export default AuthProvider;
