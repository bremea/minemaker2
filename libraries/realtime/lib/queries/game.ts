import type { Msg } from '@nats-io/transport-node';
import type { FindServerResponse } from '../types';
import { createMultiResponseQuery, listenForQuery } from '../utils';

/** Finds available (not full) servers running a specific gameId */
export async function findServer(gameId: string): Promise<FindServerResponse[]> {
	return await createMultiResponseQuery<FindServerResponse>(`query.game.${gameId}.findServer`);
}

/** Listens to incoming findServer queries for a specific gameId */
export async function listenForFindServer(
	gameId: string,
	callback: (gameId: string) => void
): Promise<void> {
	const onMessage = (err: Error | null, _: Msg) => {
		if (err) throw err;
		callback(gameId);
	};
	await listenForQuery(`query.game.${gameId}.findServer`, onMessage);
}

/** Asks all servers running gameId how many players they have online */
export async function getPlayersOnline(gameId: string): Promise<number[]> {
	return await createMultiResponseQuery<number>(`query.game.${gameId}.online`);
}

/** Listens to incoming online queries for a specific gameId */
export async function listenForGetPlayersOnline(
	gameId: string,
	callback: (gameId: string) => void
): Promise<void> {
	const onMessage = (err: Error | null, _: Msg) => {
		if (err) throw err;
		callback(gameId);
	};
	await listenForQuery(`query.game.${gameId}.findServer`, onMessage);
}

/** Returns sum of responses from getPlayersOnline */
export async function getTotalPlayersOnline(gameId: string): Promise<number> {
	const online = await getPlayersOnline(gameId);
	return online.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}
