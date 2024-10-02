import { GlobalContextValue } from '@/context/global.context';
import { useContext } from 'react';

export default function useGlobalContext() {
  const context = useContext(GlobalContextValue);

  if (!context) throw Error('Dont have context');
  return context;
};
