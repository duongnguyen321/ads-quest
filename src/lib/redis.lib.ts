import { dateToTime } from '@/helpers/date.helpers';
import { createClient, RedisClientType } from 'redis';

/**
 * Represents a wrapper around the Redis client for easier use with support for default TTL and custom timers.
 */
export class Redis {
	private client!: RedisClientType;
	private defaultTTL: number; // TTL in seconds

	/**
	 * Creates an instance of the Redis class.
	 * @param {number | string} defaultTTLInSeconds The default time-to-live (TTL) for keys in seconds. Can be a number or a string that represents time (which will be converted using the timer function).
	 */
	constructor(defaultTTLInSeconds?: number | string) {
		this.defaultTTL =
			typeof defaultTTLInSeconds === 'string'
				? dateToTime(defaultTTLInSeconds)
				: defaultTTLInSeconds || 86400; // Use timer for string values, default to 1 day
		this.initializeClient();
	}

	/**
	 * Sets a key-value pair in Redis with an optional TTL.
	 * @param {string} key The key to set.
	 * @param {string} value The value to set.
	 * @param {number | string} ttl Optional. Time to live for the key, can be a number (in seconds) or a string (e.g., "2 days"). Defaults to the instance's default TTL.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	async set(
		key: string,
		value: string,
		ttl: number | string = this.defaultTTL
	): Promise<void> {
		const effectiveTTL = typeof ttl === 'string' ? dateToTime(ttl) : ttl;
		await this.client.setEx(key, effectiveTTL, value);
	}

	/**
	 * Retrieves the value of a key from Redis.
	 * @param {string} key The key to retrieve.
	 * @returns {Promise<string | null>} A promise that resolves with the value of the key or null if the key does not exist.
	 */
	async get(key: string): Promise<string | null> {
		return this.client.get(key);
	}

	/**
	 * Deletes a key from Redis.
	 * @param {string} key The key to delete.
	 * @returns {Promise<number>} A promise that resolves with the number of keys that were deleted.
	 */
	async del(key: string): Promise<number> {
		console.info(`Delete cache in key ${key}`)
		return this.client.del(key);
	}

	/**
	 * Caches data or retrieves it from the cache if already stored, with an optional TTL.
	 * @param {string} key The cache key.
	 * @param {() => Promise<T>} callback A callback that returns the data to cache if not already cached.
	 * @param {number | string} ttl Optional. Time to live for the key, can be a number (in seconds) or a string (e.g., "1 month"). Defaults to the instance's default TTL.
	 * @returns {Promise<T>} A promise that resolves with cached data or the result of the callback function.
	 */
	async cached<T>(
		key: string,
		callback: () => Promise<T>,
		ttl?: number | string
	): Promise<T> {
		const cachedValue = await this.get(key);
		if (cachedValue) {
			console.info(`Get from redis because ${key} have in redis.`);
			return JSON.parse(cachedValue) as T;
		} else {
			console.info(`Query database because ${key} dont have in redis.`)
			const data = await callback();
			if (data) {
				const effectiveTTL = ttl
					? typeof ttl === 'string'
						? dateToTime(ttl)
						: ttl
					: this.defaultTTL;
				this.set(key, JSON.stringify(data), effectiveTTL);
			}
			return data;
		}
	}

	/**
	 * Deletes all keys in the Redis database.
	 * @returns {Promise<void>} A promise that resolves when all keys have been deleted.
	 */
	async deleteAll(): Promise<void> {
		const keys = await this.client.keys('*');
		await Promise.all(keys.map((key: string) => this.del(key)));
	}

	/**
	 * Deletes keys matching a pattern.
	 * @param {string} pattern The pattern to match keys against.
	 * @returns {Promise<number>} A promise that resolves with the total number of keys deleted.
	 */
	async delPattern(pattern: string): Promise<number> {
		let cursor = 0;
		let totalDeleted = 0;

		do {
			const found = await this.client.scan(cursor, {
				MATCH: pattern,
				COUNT: 100,
			});
			const { keys, cursor: newCursor } = found;
			cursor = +newCursor;
			if (keys.length) {
				const deleted = await this.client.del(keys);
				totalDeleted += deleted;
			}
		} while (cursor !== 0);

		return totalDeleted;
	}

	/**
	 * Initializes the Redis client and establishes a connection.
	 * @private
	 */
	private async initializeClient() {
		const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

		this.client = createClient({
			password: REDIS_PASSWORD,
			socket: {
				host: REDIS_HOST,
				port: REDIS_PORT ? +REDIS_PORT || undefined : undefined,
			},
		});
		this.client.on('error', (err: string) =>
			console.error('Redis Client Error', err)
		);
		await this.client.connect();
	}
}

/**
 * @default redis cached
 * @default cached = 1 day
 */
const redis = new Redis();
export default redis;
