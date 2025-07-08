import type RestClient from '..';
import type { ApiPlayer, ApiUser } from '@minemaker/types';

export async function getMe(client: RestClient): Promise<ApiUser> {
	return await client.request<ApiUser>('GET', 'user/me');
}

export async function linkRequestOauth(client: RestClient, code: string): Promise<ApiPlayer> {
	return await client.request<ApiPlayer>('GET', `user/link/oauth?code=${code}`);
}

export async function confirmLink(client: RestClient, code: string): Promise<ApiUser> {
	return await client.request<ApiUser>('POST', `user/link`, { body: JSON.stringify({ code }) });
}

export * from './session';
