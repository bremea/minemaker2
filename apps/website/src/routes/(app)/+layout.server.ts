import { PUBLIC_API_URL } from '$env/static/public';
import RestClient, { getMe, staticTokenRefresh } from '@minemaker/caller';

export const load = async ({ cookies }) => {
	if (cookies.get('token') == undefined || cookies.get('refresh') == undefined) {
		return {
			loggedIn: false
		};
	}

	const token = cookies.get('token')!;
	const refreshToken = cookies.get('refresh')!;

	const onRefresh = (token: string, refresh: string) => {
		cookies.set('token', token, {
			httpOnly: true,
			secure: !process.env.DEVELOPMENT_MODE,
			path: '/',
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
		});
		cookies.set('refresh', refresh, {
			httpOnly: true,
			secure: !process.env.DEVELOPMENT_MODE,
			path: '/',
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
		});
	};

	const apiClient = new RestClient(token, {
		apiUrl: PUBLIC_API_URL,
		refreshWithCookie: true,
		refreshToken,
		onRefresh
	});

	try {
		const me = await getMe(apiClient);

		return {
			loggedIn: true,
			me
		};
	} catch (e) {
		return {
			loggedIn: false
		};
	}
};
