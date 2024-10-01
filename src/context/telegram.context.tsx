'use client';
import BackButtonManipulator from '@/components/core/BackButtonManipulator';
import ErrorPage from '@/components/ErrorPage';
import { useTelegramMock } from '@/development/hooks/useTelegramMock';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@tma.js/sdk-react';
import type { ITelegramUser, IWebApp, IWebView } from '@ts//telegram.types';
import { createContext, useEffect, useMemo, useState } from 'react';

export interface ITelegramContext {
  webApp?: IWebApp;
  webView?: IWebView;
  user?: ITelegramUser;
  unsafeData?: IWebApp['initDataUnsafe'];
}

export const TelegramContextValue = createContext<ITelegramContext>({});
export const TelegramProvider = ({
                                   children,
                                 }: {
  children: React.ReactNode;
}) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const [webApp, setWebApp] = useState<IWebApp | null>(null);
  const [webView, setWebView] = useState<IWebView | null>(null);

  const miniApp = useMiniApp(true);
  const themeParams = useThemeParams(true);
  const viewport = useViewport(true);

  useEffect(() => {
    return miniApp && themeParams && bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return themeParams && bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);


  useEffect(() => {
    const app = window.Telegram?.WebApp as IWebApp;
    const view = window.Telegram?.WebView as IWebView;
    if (app) {
      app?.expand();
      app?.enableClosingConfirmation?.();
      app?.disableVerticalSwipes?.();

      app?.MainButton?.hide?.();
      app?.BackButton?.hide?.();
      setWebApp(app);
    }
    if (view) {
      setWebView(view);
    }
  }, []);

  const value = useMemo(() => {
    const valueContext: ITelegramContext = {};
    if (webApp) {
      valueContext.webApp = webApp;
      valueContext.unsafeData = webApp?.initDataUnsafe;
      valueContext.user = webApp?.initDataUnsafe?.user;
    }
    if (webView) {
      valueContext.webView = webView;
    }
    return valueContext;
  }, [webApp, webView]);

  // const disableDevice = [];
  const disableDevice = ['desktop', 'web', 'macos'];
  const isDisable = disableDevice.some((key) =>
    webApp?.platform.toLowerCase().includes(key),
  );

  if (isDisable && process.env.NODE_ENV !== 'development') {
    console.error('Telegram Desktop is not supported.');
    return <ErrorPage title={'Telegram Desktop is not supported.'} />;
  }
  return (
    <TelegramContextValue.Provider value={value}>
      {process.env.NODE_ENV !== 'development' && (<BackButtonManipulator />)}
      {children}
    </TelegramContextValue.Provider>
  );
};
