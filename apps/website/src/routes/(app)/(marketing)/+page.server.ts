import { PUBLIC_API_URL } from '$env/static/public';
import RestClient, { getMe } from '@minemaker/caller';
import { getMostPopular } from '@minemaker/caller';
import { getPlaylog } from '@minemaker/caller';

export const load = async ({ cookies, parent }) => {
	const layoutData = await parent();

	const token = cookies.get('token');

	const apiClient = new RestClient(token ?? '', {
		apiUrl: PUBLIC_API_URL,
		refreshWithCookie: true,
		useCookieAuth: token == undefined
	});

	try {
		const mostPopular = await getMostPopular(apiClient);

		if (!layoutData.loggedIn) {
			return {
				mostPopular
			};
		} else {
			return {
				recentlyPlayed: await getPlaylog(apiClient),
				mostPopular
			};
		}
	} catch (e) {
		return;
	}
};
