export interface ITelegramUser {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	language_code: string;
	is_premium?: boolean;
}

type WebViewOptionsType = 'impact';
type WebViewOptionsStyle = 'medium';

export interface WebViewOptions {
	type: WebViewOptionsType;
	impact_style: WebViewOptionsStyle;
}

export interface IWebView {
	postEvent: (
		event: string,
		callback: () => void,
		option?: WebViewOptions
	) => void;
}

export interface IWebApp {
	initData: string;
	initDataUnsafe: {
		query_id: string;
		user: ITelegramUser;
		auth_date: string;
		hash: string;
	};
	version: string;
	platform: string;
	colorScheme: string;
	themeParams: {
		link_color: string;
		button_color: string;
		button_text_color: string;
		secondary_bg_color: string;
		hint_color: string;
		bg_color: string;
		text_color: string;
	};
	isExpanded: boolean;
	viewportHeight: number;
	viewportStableHeight: number;
	isClosingConfirmationEnabled: boolean;
	headerColor: string;
	backgroundColor: string;
	BackButton: {
		isVisible: boolean;
		hide: () => void;
		show: () => void;
	};
	MainButton: {
		text: string;
		color: string;
		textColor: string;
		isVisible: boolean;
		isProgressVisible: boolean;
		isActive: boolean;
		hide: () => void;
		show: () => void;
	};
	HapticFeedback: unknown;
	ready: () => void;
	expand: () => void;
	enableClosingConfirmation: () => void;
	disableVerticalSwipes: () => void;
}

interface TelegramChatData {
	message_id: number;
	from: {
		id: number;
		is_bot: boolean;
		first_name: string;
		username: string;
		language_code: string;
		is_premium?: boolean;
	};
	chat: {
		id: number;
		first_name: string;
		username: string;
		type: string;
		is_premium?: boolean;
	};
	date: number;
	text: string;
	entities: {
		offset: number;
		length: number;
		type: string;
	}[];
}

export interface TelegramRoute {
	update_id: number;
	message?: TelegramChatData;
	my_chat_member?: TelegramChatData;
	old_chat_member?: {
		user: ITelegramUser;
		status: 'member' | 'kicked';
	};
}
