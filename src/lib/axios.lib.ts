import { SERVER_URI } from '@/configs/site.configs';
import { parseObj } from '@/helpers/string.helpers';
import type { User } from '@ts//user.types';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

interface Response<T = unknown> {
	statusCode?: number;
	code?: number;
	timestamp?: string;
	path?: string;
	message: string;
	data?: T;
}

class Axios {
	private instance: AxiosInstance;
	private interceptor: number | null = null;

	constructor() {
		const instance = axios.create({
			baseURL: SERVER_URI,
		});

		// Response interceptor
		const interceptor = instance.interceptors.response.use(
			(response: AxiosResponse) => response.data,
			(error: AxiosError) => {
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('userinfo');
				}
				return Promise.reject(error);
			}
		);

		// Request interceptor
		instance.interceptors.request.use(
			async (config) => {
				const userInfoStr = localStorage.getItem('userinfo');
				const userInfo = parseObj<User>(userInfoStr);
				const cookies = document.cookie; // Get all cookies
				const ipAddress = await this.getIpAddress(); // Fetch IP address

				if (userInfo && config.headers) {
					config.headers['X-user-id'] = userInfo.id;
					config.headers['X-user-telegram-id'] = userInfo.telegramId;
					config.headers['X-username'] = userInfo.username;
					config.headers['X-user'] = userInfoStr;
				}

				// Add custom headers
				if (config.headers) {
					config.headers['X-Cookies'] = cookies;
					config.headers['X-Ip-Address'] = ipAddress;
				}

				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		this.interceptor = interceptor;
		this.instance = instance;
	}

	public get Instance(): AxiosInstance {
		return this.instance;
	}

	// Create
	public post<DATA = unknown, BODY = unknown>(
		url: string,
		data?: BODY,
		config?: AxiosRequestConfig
	): Promise<Response<DATA>> {
		this.useInterceptor();
		return this.Instance.post<string, Response<DATA>>(url, data, config);
	}

	// Read
	public get<DATA = unknown>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<Response<DATA>> {
		this.useInterceptor();
		return this.Instance.get<string, Response<DATA>>(url, config);
	}

	// Update
	public put<DATA = unknown, BODY = unknown>(
		url: string,
		data?: BODY,
		config?: AxiosRequestConfig
	): Promise<Response<DATA>> {
		this.useInterceptor();
		return this.Instance.put<string, Response<DATA>>(url, data, config);
	}

	// Delete
	public delete<DATA = unknown>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<Response<DATA>> {
		this.useInterceptor();
		return this.Instance.delete<string, Response<DATA>>(url, config);
	}

	// Post with full response
	public pull<DATA = unknown, BODY = unknown>(
		url: string,
		data?: BODY,
		config?: AxiosRequestConfig
	): Promise<Response<DATA>> {
		this.ejectInterceptor();
		return this.Instance.post<string, Response<DATA>>(url, data, config);
	}

	private useInterceptor() {
		if (this.interceptor === null) {
			const interceptor = this.instance.interceptors.response.use(
				(response: AxiosResponse) => response.data,
				(error: AxiosError) => Promise.reject(error)
			);
			this.interceptor = interceptor;
		}
	}

	private ejectInterceptor() {
		if (this.interceptor !== null) {
			this.instance.interceptors.response.eject(this.interceptor);
			this.interceptor = null;
		}
	}

	private async getIpAddress(): Promise<string> {
		try {
			const response = await axios.get('13.250.181.87');
			return response.data; // This will return the IP address as text
		} catch (error) {
			console.error('Error fetching IP address:', error);
			return '0.0.0.0'; // Fallback IP address in case of error
		}
	}
}

const client = new Axios();

export default client;
