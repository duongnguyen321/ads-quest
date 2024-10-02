'use client';

import { createContext, type Dispatch, type SetStateAction, useMemo, useState } from 'react';

export interface IGlobalContext {
  isCongrats: boolean;
  setIsCongrats: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContextValue = createContext<IGlobalContext>({
  isCongrats: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsCongrats(_: ((prevState: boolean) => boolean) | boolean): void {
  },
});
export default function GlobalProvider({
                                         children,
                                       }: {
  children: React.ReactNode;
}) {
  const [isCongrats, setIsCongrats] = useState<boolean>(false);

  const value = useMemo(() => ({ isCongrats, setIsCongrats }), [isCongrats]);

  return (
    <GlobalContextValue.Provider value={value}>
      {children}
    </GlobalContextValue.Provider>
  );
};
