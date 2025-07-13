import { PUBLIC_API_URL } from '$env/static/public';
import RestClient, { getMe } from '@minemaker/caller';

export const load = async ({ cookies }) => {
	if (cookies.get('token') == undefined) {
		return {
			loggedIn: false
		};
	}

	const token = cookies.get('token')!;

	const apiClient = new RestClient(token, {
		apiUrl: PUBLIC_API_URL,
		refreshWithCookie: true
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
