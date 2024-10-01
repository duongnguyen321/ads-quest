import type { IWebView } from '@ts//telegram.types';

export const vibration = (webView: IWebView) => {
	webView?.postEvent('web_app_trigger_haptic_feedback', () => {}, {
		type: 'impact',
		impact_style: 'medium',
	});
};

const telegram = {
	vibration,
};
export default telegram;
