import { PUBLIC_API_URL } from '$env/static/public';
import RestClient, { getProfile } from '@minemaker/caller';
import { getGame } from '@minemaker/caller';
import { error } from '@sveltejs/kit';

export const load = async ({ cookies, parent, params }) => {
	const layoutData = await parent();

	const token = cookies.get('token');

	const apiClient = new RestClient(token ?? '', {
		apiUrl: PUBLIC_API_URL,
		refreshWithCookie: true,
		useCookieAuth: token == undefined
	});

	try {
		const game = await getGame(apiClient, params.id);

		return { game };
	} catch (e) {
		throw error(404);
	}
};
