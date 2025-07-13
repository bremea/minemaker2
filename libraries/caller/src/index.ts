export * from './user/index';
export * from './games/index';

type HttpMethods =
	| 'GET'
	| 'HEAD'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'CONNECT'
	| 'OPTIONS'
	| 'TRACE'
	| 'PATCH';

interface ClientOptions {
	apiUrl: string;
	refreshWithCookie: boolean;
	useCookieAuth?: boolean;
}

interface RequestOptions extends BunFetchRequestInit {
	refreshIfUnauthorized?: boolean;
}

export default class RestClient {
	public authorization: string;
	public options: ClientOptions;

	constructor(token: string, options: ClientOptions) {
		if (!token && !options.useCookieAuth) throw new Error('No token provided');
		this.authorization = `Bearer ${token}`;
		this.options = options;
	}

	public async request<T>(
		method: HttpMethods,
		endpoint: string,
		options?: RequestOptions
	): Promise<T> {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...options?.headers
		} as Record<string, string>;

		if (!this.options.useCookieAuth) {
			headers.Authorization = this.authorization;
		}

		const req = await fetch(`${this.options.apiUrl}/${endpoint}`, {
			method,
			headers,
			...options
		});

		try {
			var res;

			if (req.headers.get('Content-Type')?.includes('application/json')) {
				res = await req.json();
			} else {
				res = await req.text();
			}
		} catch (e) {
			throw { error: true, code: -1, message: 'Parse error' };
		}

		if (!req.ok || res['error']) {
			if (options?.refreshIfUnauthorized) {
				await this.refreshToken(this.options.useCookieAuth ?? false);
				return await this.request<T>(method, endpoint, {
					...options,
					refreshIfUnauthorized: false
				});
			} else {
				throw res as { error: boolean; message?: string; code: number };
			}
		}

		return res;
	}

	public async refreshToken(useCookieAuth: boolean = false): Promise<void> {
		const newToken = await this.request<{ token: string }>(
			'GET',
			`/api/user/session/refresh${useCookieAuth ? '?setCookie=true' : ''}`
		);
		this.authorization = `Bearer ${newToken.token}`;
	}
}
