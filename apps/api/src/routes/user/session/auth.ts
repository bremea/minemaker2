import type { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import { userExists, createUser } from '@minemaker/db';

export default (app: ElysiaApp) =>
	app.post(
		'/',
		async ({ body, jwt, cookie: { refreshToken } }) => {
			const accessTokenRequest = await fetch(
				'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: `client_id=${process.env.MICROSOFT_CLIENT_ID}&scope=XboxLive.signin%20XboxLive.offline_access&code=${body.code}&redirect_uri=${process.env.MICROSOFT_CLIENT_REDIRECT_URI}&grant_type=authorization_code&client_secret=${process.env.MICROSOFT_CLIENT_SECRET}`
				}
			);

			const accessTokenResponse = await accessTokenRequest.json();

			if (accessTokenResponse['error'] != undefined) {
				throw accessTokenResponse['error_description'];
			}

			/* Fetch UUID & username from minecraft API, and email from Microsoft account */
			/* These are temp values for testing */
			const uuid = process.env.DEVELOPMENT_UUID!;
			const username = process.env.DEVELOPMENT_USERNAME!;
			const email = process.env.DEVELOPMENT_EMAIL!;

			if (!(await userExists(uuid))) {
				await createUser(uuid, username, email);
			}

			refreshToken.set({
				path: '/api/user/session/refresh',
				httpOnly: true,
				sameSite: true
			});

			return {
				token: await jwt.sign({ uuid })
			};
		},
		{ body: t.Object({ code: t.String() }) }
	);
