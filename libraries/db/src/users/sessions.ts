import { pool } from '$src/connection';
import { InternalApiError, DatabaseSession, DatabaseTrustedIp } from '@minemaker/types';

/** Add trusted ip */
export async function addTrustedIp(accountId: string, ip: string): Promise<void> {
	await pool.query('INSERT INTO trusted_ips (account_id, ip) VALUES (?, ?);', [accountId, ip]);
}

/** Check trusted IP */
export async function checkIpTrusted(accountId: string, ip: string): Promise<boolean> {
	const [ipData] = await pool.query<DatabaseTrustedIp[]>(
		'SELECT * FROM trusted_ips WHERE account_id = ? AND ip = ?;',
		[accountId, ip]
	);

	return ipData.length > 0;
}

/** Refresh trusted id last login time */
export async function updateTrustedIpLogin(accountId: string, ip: string): Promise<void> {
	await pool.query('UPDATE trusted_ips SET last_login = now() WHERE account_id = ? AND ip = ?;', [accountId, ip]);
}

/** Create new session */
export async function createSession(
	sessionId: string,
	accountId: string,
	ip: string,
	userAgent: string
): Promise<void> {
	await pool.query(
		'INSERT INTO sessions (session_id, account_id, last_ip, user_agent) VALUES (?, ?, ?, ?);',
		[sessionId, accountId, ip, userAgent]
	);
}

/** Invalidate session */
export async function invalidateSession(sessionId: string): Promise<void> {
	await pool.query('DELETE FROM sessions WHERE session_id = ?;', [sessionId]);
}

/** Invalidate all sessions under user */
export async function invalidateAllUserSessions(accountId: string): Promise<void> {
	await pool.query('DELETE FROM sessions WHERE account_id = ?;', [accountId]);
}

/** Update session IP */
export async function updateSessionIp(sessionId: string, ip: string): Promise<void> {
	await pool.query('UPDATE sessions SET ip = ? WHERE session_id = ?;', [ip, sessionId]);
}

/** Get session data */
export async function getSession(sessionId: string): Promise<DatabaseSession> {
	const [sessionData] = await pool.query<DatabaseSession[]>(
		'SELECT * FROM sessions WHERE session_id = ?;',
		[sessionId]
	);

	if (sessionData.length == 0) {
		throw new InternalApiError(400, 'Invalid refresh token');
	}

	return sessionData[0];
}
