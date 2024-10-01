import { IWebApp, IWebView } from 'src/types/telegram.types';

declare global {
	interface Window {
		Telegram: {
			WebApp: IWebApp;
			WebView: IWebView;
		};
	}
}
