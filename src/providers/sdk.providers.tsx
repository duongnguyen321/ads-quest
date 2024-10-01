'use client';

import { CLIENT_URL, TELEGRAM_URL } from '@/configs/site.configs';
import { includeWallets } from '@/configs/ton.configs';
import { SDKProvider } from '@tma.js/sdk-react';
import { TonConnectUIProvider, type UIWallet } from '@tonconnect/ui-react';

function SDKProviders({ children }: { children: React.ReactNode }){
  return (
    <TonConnectUIProvider
      manifestUrl={`${CLIENT_URL}/tonconnect-manifest.json`}
      walletsListConfiguration={{
        includeWallets: includeWallets as UIWallet[],
      }}
      actionsConfiguration={{
        twaReturnUrl: TELEGRAM_URL as `${string}://${string}`,
      }}
    >
      <SDKProvider acceptCustomStyles>{children}</SDKProvider>
    </TonConnectUIProvider>
  );
}

export default SDKProviders
