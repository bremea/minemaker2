import { getAccessTokenFromCode, getMe, type User } from '@minemaker/caller/src';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ url, cookies }) => {
	if (!url.searchParams.has('code')) {
		redirect(303, '/login');
	}
	try {
		const tokenData = await getAccessTokenFromCode(PUBLIC_API_URL, url.searchParams.get('code')!);

		cookies.set('refresh', tokenData.refreshToken, {
			httpOnly: true,
			sameSite: true,
			path: '/api/user/session/refresh'
		});

		return {
			token: tokenData.token
		};
	} catch (e) {
		return error(500, `${e}`);
	}
};
