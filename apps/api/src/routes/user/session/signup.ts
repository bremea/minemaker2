import type { ElysiaApp } from '$src/app';
import { addTrustedIp, createSession, createUser, userExists } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import bcrypt from 'bcrypt';

export default (app: ElysiaApp) =>
	app.post(
		'/',
		async ({ cookie: { refresh }, jwt, ip, snowflake, body, headers }) => {
			if (await userExists(body.email)) {
				throw new InternalApiError(400, 'Email already in use');
			}

			if (ip === '::1' || ip === '::ffff:127.0.0.1') {
				ip = '127.0.0.1';
			}

			const hash = await bcrypt.hash(body.password, 10);
			const id = snowflake.nextId().toString();

			await createUser(id, body.email, hash);
			await addTrustedIp(id, ip);

			const sessionId = snowflake.nextId().toString();
			const userAgent = headers['User-Agent'] ?? 'Unknown';
			await createSession(sessionId, id, ip, userAgent);

			const refreshToken = await jwt.sign({
				id: sessionId,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // expires in 30 days
			});

			const newToken = await jwt.sign({
				id: id,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
			});

			refresh.set({
				httpOnly: true,
				secure: !process.env.DEVELOPMENT_MODE,
				path: '/api/user/session/refresh',
				value: refreshToken
			});

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
					minLength: 8,
					error: 'Invalid password',
					pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,200}$'
				})
			})
		}
	);
