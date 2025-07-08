import type RestClient from '..';
import type { ApiUser } from '@minemaker/types';

export async function getMe(client: RestClient): Promise<ApiUser> {
	return await client.request<ApiUser>('GET', 'user/me');
}

export async function linkOauth(client: RestClient, code: string): Promise<ApiUser> {
	return await client.request<ApiUser>('PUT', `user/session/link/oauth`, {
		body: JSON.stringify({ code })
	});
}

export * from './session';
