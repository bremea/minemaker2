import type { ElysiaApp } from '$src/app';
import { createPlayer, getPlayer, linkPlayer } from '@minemaker/db';
import { InternalApiError, ApiPlayer } from '@minemaker/types';
import { t } from 'elysia';
import { blockAuth } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(blockAuth).put(
		'/',
		async ({ body, id }) => {
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

			try {
				var accessTokenResponse = await accessTokenRequest.json();
			} catch (e) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			if (accessTokenResponse['error'] != undefined) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			/* Fetch UUID & username from minecraft API */

			const xboxAuth = await fetch('https://user.auth.xboxlive.com/user/authenticate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					Properties: {
						AuthMethod: 'RPS',
						SiteName: 'user.auth.xboxlive.com',
						RpsTicket: `d=${accessTokenResponse.access_token}`
					},
					RelyingParty: 'http://auth.xboxlive.com',
					TokenType: 'JWT'
				})
			});

			if (!xboxAuth.ok) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			try {
				var xboxAuthResponse = await xboxAuth.json();
			} catch (e) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			const xblToken = xboxAuthResponse['Token'];
			const userHash = xboxAuthResponse['DisplayClaims']['xui'][0]['uhs'];

			const xtsTokenRequest = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					Properties: {
						SandboxId: 'RETAIL',
						UserTokens: [xblToken]
					},
					RelyingParty: 'rp://api.minecraftservices.com/',
					TokenType: 'JWT'
				})
			});

			if (!xtsTokenRequest.ok) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			try {
				var xtsTokenResponse = await xtsTokenRequest.json();
			} catch (e) {
				throw new InternalApiError(500, 'Xbox API returned an error');
			}

			const xtsToken = xtsTokenResponse['Token'];

			const minecraftAuthRequest = await fetch(
				'https://api.minecraftservices.com/authentication/login_with_xbox',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify({
						identityToken: `XBL3.0 x=${userHash};${xtsToken}`
					})
				}
			);

			if (!minecraftAuthRequest.ok) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			try {
				var minecraftAuthResponse = await minecraftAuthRequest.json();
			} catch (e) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			const minecraftAccessToken = minecraftAuthResponse['access_token'];

			const minecraftProfileRequest = await fetch(
				'https://api.minecraftservices.com/minecraft/profile',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${minecraftAccessToken}`
					}
				}
			);

			if (!minecraftProfileRequest.ok) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			try {
				var minecraftProfile = await minecraftProfileRequest.json();
			} catch (e) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			if (minecraftProfile['error'] !== undefined) {
				throw new InternalApiError(500, 'Minecraft API returned an error');
			}

			const uuid = minecraftProfile['id'];
			const username = minecraftProfile['name'];

			await createPlayer(uuid, username);
			await linkPlayer(id, uuid);
			const playerData = await getPlayer(uuid);

			const player: ApiPlayer = {
				uuid,
				username,
				created: playerData.created_at,
				lastLogin: playerData.last_login
			};

			return player;
		},
		{ body: t.Object({ code: t.String() }) }
	);
