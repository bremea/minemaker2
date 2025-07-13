import type { ElysiaApp } from '$src/app';
import {
	addTrustedIp,
	checkIpTrusted,
	createSession,
	createUser,
	getUser,
	getUserByEmail,
	updateTrustedIpLogin,
	userExists
} from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import bcrypt from 'bcrypt';

export default (app: ElysiaApp) =>
	app.post(
		'/',
		async ({ cookie: { refresh, token }, jwt, ip, snowflake, headers, body }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1') {
				ip = '127.0.0.1';
			}

			try {
				var user = await getUserByEmail(body.email);
			} catch (e) {
				console.error(e);
				throw new InternalApiError(400, 'Incorrect email or password');
			}

			const passwordMatches = await bcrypt.compare(body.password, user.password);

			if (!passwordMatches) {
				throw new InternalApiError(400, 'Incorrect email or password');
			}

			const ipIsTrusted = await checkIpTrusted(user.account_id, ip);

			if (!ipIsTrusted) {
				throw new InternalApiError(400, 'Invalid IP address ' + ip);
			}

			const sessionId = snowflake.nextId().toString();
			const userAgent = headers['User-Agent'] ?? 'Unknown';
			await createSession(sessionId, user.account_id, ip, userAgent);
			await updateTrustedIpLogin(user.account_id, ip);

			const refreshToken = await jwt.sign({
				id: sessionId,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // expires in 30 days
			});

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

			refresh.set({
				httpOnly: true,
				secure: !process.env.DEVELOPMENT_MODE,
				path: body.setCookie ? '/' : '/api/user/session/refresh',
				value: refreshToken
			});

			if (body.setCookie) {
				token.set({
					httpOnly: true,
					secure: !process.env.DEVELOPMENT_MODE,
					value: newToken
				});
			}

			return {
				token: newToken,
				refreshToken
			};
		},
		{
			body: t.Object({
				email: t.String({
					format: 'email',
					maxLength: 150,
					error: 'Invalid email'
				}),
				password: t.String({
					maxLength: 200,
					error: 'Invalid password'
				}),
				setCookie: t.Optional(t.Boolean())
			})
		}
	);
