export * from './user/index';
export * from './types/index';

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
}

interface RequestOptions extends BunFetchRequestInit {
	refreshIfUnauthorized: boolean;
}

export default class RestClient {
	public authorization: string;
	public options: ClientOptions;

	constructor(token: string, options: ClientOptions) {
		if (!token) throw new Error('No token provided');
		this.authorization = `Bearer ${token}`;
		this.options = options;
	}

	public async request<T>(
		method: HttpMethods,
		endpoint: string,
		options?: RequestOptions
	): Promise<T> {
		const req = await fetch(`${this.options.apiUrl}/${endpoint}`, {
			method,
			headers: {
				Authorization: this.authorization,
				'Content-Type': 'application/json',
				...options?.headers
			},
			...options
		});

		if (!req.ok) {
			if (req.status == 301 && options?.refreshIfUnauthorized) {
				await this.refreshToken();
				return await this.request<T>(method, endpoint, {
					...options,
					refreshIfUnauthorized: false
				});
			} else {
				throw req;
			}
		}

		if (req.headers.get('Content-Type')?.includes('application/json')) {
			return (await req.json()) as T;
		} else {
			return (await req.text()) as T;
		}
	}

	public async refreshToken(): Promise<void> {
		const newToken = await this.request<{ token: string }>('GET', '/api/user/session/refresh');
		this.authorization = `Bearer ${newToken.token}`;
	}
}
