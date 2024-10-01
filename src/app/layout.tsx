import AOSInit from '@/components/core/AosInit';
import Navbar from '@/components/core/Navbar';
import { fontMono, fontSans } from '@/configs/fonts.configs';
import { CLIENT_URL, siteConfig } from '@/configs/site.configs';
import { TelegramProvider } from '@/context/telegram.context';
import { makeDescription, makeTitle } from '@/helpers/string.helpers';
import { cn } from '@/helpers/tailwind.helpers';
import AuthProvider from '@/providers/auth.providers';
import NextUIProviders from '@/providers/nextui.providers';
import '@/assets/styles/globals.css';
import SDKProviders from '@/providers/sdk.providers';
import type { Viewport } from 'next';
import Script from 'next/script';
import { Toaster } from 'sonner';

export async function generateMetadata() {
  return {
    title: makeTitle(siteConfig.name),
    description: makeDescription(siteConfig.description),
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    openGraph: {
      title: makeTitle(siteConfig.name),
      description: makeDescription(siteConfig.description),
      images: [
        {
          url: CLIENT_URL + '/favicon.ico',
          alt: makeDescription(siteConfig.description),
        },
      ],
    },
    metadataBase: new URL(CLIENT_URL as string),
  };
}


export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
    <head>
      <Script id={'telegram-init'} src={'/telegram.js'} strategy="beforeInteractive" />
    </head>
    <body
      className={cn(
        fontSans.variable,
        fontMono.variable,
        'antialiased flex justify-center bg-black text-white w-screen min-h-screen',
      )}
    >
    <AOSInit />
    <SDKProviders>
      <TelegramProvider>
        <AuthProvider>
          <NextUIProviders attribute="class" defaultTheme="dark">
            <Navbar />
            <main>
              {children}
            </main>
            <Toaster richColors />
          </NextUIProviders>
        </AuthProvider>
      </TelegramProvider>
    </SDKProviders>
    </body>
    </html>
  );
}
