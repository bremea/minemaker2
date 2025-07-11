import type RestClient from '..';
import type { ApiPlaylog } from '@minemaker/types';

export async function getPlaylog(client: RestClient): Promise<ApiPlaylog> {
	return await client.request<ApiPlaylog>('GET', 'user/player/playlog');
}
