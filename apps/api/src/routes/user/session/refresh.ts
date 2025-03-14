import type { ElysiaApp } from '$src/app';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.get('/', async ({ cookie: { refresh }, jwt }) => {
		const accessTokenRequest = await fetch(
			'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `client_id=${process.env.MICROSOFT_CLIENT_ID}&scope=XboxLive.signin%20XboxLive.offline_access&refresh_token=${refresh}&grant_type=refresh_token&client_secret=${process.env.MICROSOFT_CLIENT_SECRET}`
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

		refresh.set({
			value: accessTokenResponse['refresh_token'],
			sameSite: true,
			httpOnly: true
		});

		return {
			token: await jwt.sign({ uuid })
		};
	});
