import type { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import { userExists, createUser } from '@minemaker/db';

export default (app: ElysiaApp) =>
	app.get(
		'/',
		async ({ query, jwt }) => {
			const accessTokenRequest = await fetch(
				'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: `client_id=${process.env.MICROSOFT_CLIENT_ID}&scope=XboxLive.signin%20XboxLive.offline_access&code=${query.code}&redirect_uri=${process.env.MICROSOFT_CLIENT_REDIRECT_URI}&grant_type=authorization_code&client_secret=${process.env.MICROSOFT_CLIENT_SECRET}`
				}
			);

			try {
				var accessTokenResponse = await accessTokenRequest.json();
			} catch (e) {
				throw 'Internal error';
			}

			if (accessTokenResponse['error'] != undefined) {
				throw 'Invalid code';
			}

			/* Fetch UUID & username from minecraft API, and email from Microsoft account */
			/* These are temp values for testing */
			const uuid = process.env.DEVELOPMENT_UUID!;
			const username = process.env.DEVELOPMENT_USERNAME!;
			const email = process.env.DEVELOPMENT_EMAIL!;

			if (!(await userExists(uuid))) {
				await createUser(uuid, username, email);
			}

			return {
				token: await jwt.sign({ uuid }),
				refreshToken: accessTokenResponse['refresh_token']
			};
		},
		{ query: t.Object({ code: t.String() }) }
	);
