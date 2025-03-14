import type { ElysiaApp } from '$src/app';

export default (app: ElysiaApp) =>
	app.get('/', async ({ cookie: { refreshToken } }) => {
		const accessTokenRequest = await fetch(
			'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `client_id=${process.env.MICROSOFT_CLIENT_ID}&scope=XboxLive.signin%20XboxLive.offline_access&code=${refreshToken.value}&redirect_uri=${process.env.MICROSOFT_CLIENT_REDIRECT_URI}&grant_type=authorization_code&client_secret=${process.env.MICROSOFT_CLIENT_SECRET}`
			}
		);

		const accessTokenResponse = await accessTokenRequest.json();

		if (accessTokenResponse['error'] != undefined) {
			throw accessTokenResponse['error_description'];
		} else {
			return {
				token: accessTokenResponse['access_token']
			};
		}
	});
