import type { GetPresenceResponse } from '../types';
import { createQuery } from '../utils';

/** Gets a player's presence, returns null if no servers have player online */
export async function getPlayerPresence(playerUUID: string): Promise<GetPresenceResponse | null> {
	return await createQuery<GetPresenceResponse>(`query.player.${playerUUID}.presence`);
}
