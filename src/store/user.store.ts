'use client';

import { getUser } from '@/services/user.services';
import type { User } from '@ts//user.types';
import { create } from 'zustand';

interface IStoreUser {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  user: User | null;
  userId: User['telegramId'] | null,
  setUserInfo: (user: User | null) => void;
  point: User['points']
  setPoint: (type: 'point' | 'ton', point: number) => void;
  tonBalance: User['coinBalance'];
  setTonBalance: (tonValue: User['coinBalance']) => void,
  level: User['level'];
  setLevel: (level: User['level']) => void,
  refetch: (userId?: User['id'] | User['telegramId']) => Promise<User | null>
}

const useUserStore = create<IStoreUser>((set) => ({
  loading: true,
  setLoading: (isLoading: boolean) => set({ loading: isLoading }),
  userId: null,
  user: null,
  point: 0,
  setPoint: (type: 'point' | 'ton', point: number) => {
    switch (type) {
      case 'ton': {
        return set(() => ({
          tonBalance: point,
        }));
      }
      case 'point': {
        return set(() => ({
          point,
        }));
      }
    }
  },
  tonBalance: 0,
  setTonBalance: (tonBalance: number) => set({ tonBalance }),
  level: 1,
  setLevel: (level: number) => set({ level }),
  setUserInfo: (user: User | null) => {
    if (!user) return;
    return set({
      user,
      userId: user?.telegramId || null,
      point: user?.points || 0,
      level: user?.level || 1,
      tonBalance: user?.coinBalance || 0,
    });
  },
  refetch: async (userId?: User['id'] | User['telegramId']) => {
    if (!userId) return null;
    const user = await getUser(userId);
    set({
      user,
      userId: user?.telegramId || null,
      point: user?.points || 0,
      level: user?.level || 1,
      tonBalance: user?.coinBalance || 0,
    });
    return user;
  },
}));

export default useUserStore;
