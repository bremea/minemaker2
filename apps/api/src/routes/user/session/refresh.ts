import type { ElysiaApp } from '$src/app';
import { createSession, getSession, invalidateSession, updateTrustedIpLogin } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';

export default (app: ElysiaApp) =>
	app.get('/', async ({ cookie: { refresh }, jwt, snowflake, headers, ip }) => {
		if (ip === '::1' || ip === '::ffff:127.0.0.1') {
			ip = '127.0.0.1';
		}

		if (!refresh.value) {
			throw new InternalApiError(400, 'Missing refresh cookie');
		}

		const refreshData = await jwt.verify(refresh.value);

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

		refresh.set({
			httpOnly: true,
			secure: !process.env.DEVELOPMENT_MODE,
			path: '/api/user/session/refresh',
			value: refreshToken
		});

		return {
			token: await jwt.sign({
				id: sessionData.account_id,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
			})
		};
	});
