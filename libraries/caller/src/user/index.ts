import type RestClient from '..';
import type { User } from '../types';

export async function getMe(client: RestClient): Promise<User> {
	return await client.request<User>('GET', 'user/me');
}

export * from './session';
