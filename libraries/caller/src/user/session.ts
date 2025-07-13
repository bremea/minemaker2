import RestClient from '..';

export async function login(
	apiUrl: string,
	email: string,
	password: string,
	setCookie: boolean = false
): Promise<{ token: string; refreshToken: string }> {
	const request = await fetch(`${apiUrl}/user/session/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			email,
			password,
			setCookie
		})
	});

	try {
		var response = await request.json();
	} catch (e) {
		throw { error: true, code: request.status, message: await request.text() };
	}

	if (!request.ok || response['error']) {
		throw response;
	}

	return response;
}

export async function signup(
	apiUrl: string,
	email: string,
	password: string
): Promise<{ token: string; refreshToken: string }> {
	const request = await fetch(`${apiUrl}/user/session/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			email,
			password
		})
	});

	try {
		var response = await request.json();
	} catch (e) {
		throw { error: true, code: request.status, message: await request.text() };
	}

	if (!request.ok || response['error']) {
		throw response;
	}

	return response;
}

export async function staticTokenRefresh(apiUrl: string): Promise<{ token: string }> {
	const tempApiClient = new RestClient('temp', { apiUrl, refreshWithCookie: true });

	const newToken = await tempApiClient.request<{ token: string }>('GET', 'user/session/refresh');

	return newToken;
}

export async function tokenRefresh(
	apiUrl: string,
	refreshToken: string
): Promise<{ token: string; refreshToken: string }> {
	const tempApiClient = new RestClient('temp', { apiUrl, refreshWithCookie: true });

	const newToken = await tempApiClient.request<{ token: string; refreshToken: string }>(
		'POST',
		'user/session/refresh',
		{
			body: JSON.stringify({ refreshToken })
		}
	);

	return newToken;
}
