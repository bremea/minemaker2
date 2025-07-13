import { PUBLIC_API_URL } from '$env/static/public';
import RestClient, { getMe, getProfile } from '@minemaker/caller';
import { getMostPopular } from '@minemaker/caller';
import { getPlaylog } from '@minemaker/caller';

export const load = async ({ cookies, parent, params }) => {
	const layoutData = await parent();

	const token = cookies.get('token');

	const apiClient = new RestClient(token ?? '', {
		apiUrl: PUBLIC_API_URL,
		refreshWithCookie: true,
		useCookieAuth: token == undefined
	});

	return await getProfile(apiClient, params.username);
};
