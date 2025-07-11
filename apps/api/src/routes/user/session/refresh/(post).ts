import type { ElysiaApp } from '$src/app';
import { createSession, getSession, getUser, invalidateSession, updateTrustedIpLogin } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.post(
		'/',
		async ({ body, jwt, snowflake, headers, ip }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1') {
				ip = '127.0.0.1';
			}

			if (!body.refreshToken) {
				throw new InternalApiError(400, 'Missing refresh token');
			}

			const refreshData = await jwt.verify(body.refreshToken);

			if (!refreshData || typeof refreshData.id != 'string') {
				throw new InternalApiError(400, 'Invalid refresh token');
			}

			const sessionData = await getSession(refreshData.id);

			if (new Date(sessionData.expires) < new Date()) {
				throw new InternalApiError(400, 'Invalid refresh token');
			}

			const sessionId = snowflake.nextId().toString();
			const userAgent = headers['User-Agent'] ?? 'Unknown';

			invalidateSession(sessionData.session_id);
			await createSession(sessionId, sessionData.account_id, ip, userAgent);
			await updateTrustedIpLogin(sessionData.account_id, ip);

			const refreshToken = await jwt.sign({
				id: sessionId,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // expires in 30 days
			});

			const user = await getUser(sessionData.account_id);

			let newToken: string | null;

			if (user.mc_account == null) {
				newToken = await jwt.sign({
					id: user.account_id,
					exp: Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
				});
			} else {
				newToken = await jwt.sign({
					id: user.account_id,
					uuid: user.mc_account,
					exp: Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
				});
			}

			return {
				token: newToken,
				refreshToken
			};
		},
		{ body: t.Object({ refreshToken: t.String() }) }
	);
