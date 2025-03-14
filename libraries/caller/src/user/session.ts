export async function getAccessTokenFromCode(
	apiUrl: string,
	code: string
): Promise<{ token: string; refreshToken: string }> {
	const request = await fetch(`${apiUrl}/user/session/auth?code=${code}`);

	if (request.status != 200) {
		throw await request.text();
	}

	try {
		const response = await request.json();
		return response;
	} catch (e) {
		throw await request.text();
	}
}

export async function staticTokenRefresh(
	apiUrl: string,
	token?: string
): Promise<{ token: string }> {
	const request = await fetch(`${apiUrl}/user/session/refresh`);

	if (request.status != 200) {
		throw await request.text();
	}

	try {
		const response = await request.json();
		return response;
	} catch (e) {
		throw await request.text();
	}
}
