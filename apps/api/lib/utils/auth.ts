import { Elysia } from 'elysia';
import { jwt, JWTPayloadSpec } from '@elysiajs/jwt';
import { InternalApiError } from '@minemaker/types';
import { checkUserVerified, getUser } from '@minemaker/db';

export const checkAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve(
		{ as: 'global' },
		async ({ headers, jwt, cookie: { token } }): Promise<{ authResult: AuthResult }> => {
			if (headers.authorization && headers.authorization.startsWith('Bearer ')) {
				return {
					authResult: await checkToken(
						headers.authorization.substring(7, headers.authorization.length),
						jwt
					)
				};
			} else if (token.value) {
				return { authResult: await checkToken(token.value, jwt) };
			} else {
				return {
					authResult: {
						authenticated: false
					}
				};
			}
		}
	);

export const authenticatedUsersOnly = new Elysia()
	.use(checkAuth)
	.resolve({ as: 'scoped' }, async ({ authResult }) => {
		if (authResult?.authenticated) {
			return authResult;
		} else {
			throw new InternalApiError(400, 'Unauthorized');
		}
	});

export const verifiedUsersOnly = new Elysia()
	.use(checkAuth)
	.resolve({ as: 'scoped' }, async ({ authResult }) => {
		if (authResult?.authenticated) {
			if (authResult.uuid == undefined || authResult.id == undefined) {
				throw new InternalApiError(
					400,
					'Your account is not verified. Go to minemaker.net/link to link your Minecraft account, then try again.'
				);
			} else {
				return authResult as { authenticated: true; id: string; uuid: string };
			}
		} else {
			throw new InternalApiError(400, 'Unauthorized');
		}
	});

export const blockGuest = new Elysia()
	.use(checkAuth)
	.resolve({ as: 'scoped' }, async ({ authResult }) => {
		if (authResult?.authenticated) {
			if (authResult.uuid != undefined && authResult.id == undefined) {
				throw new InternalApiError(
					400,
					'Your account is not verified. Go to minemaker.net/link to link your Minecraft account, then try again.'
				);
			} else {
				return authResult as { authenticated: true; id: string };
			}
		} else {
			throw new InternalApiError(400, 'Unauthorized');
		}
	});

export const blockNonGuest = new Elysia()
	.use(checkAuth)
	.resolve({ as: 'scoped' }, async ({ authResult }) => {
		if (authResult?.authenticated) {
			if (authResult.uuid == undefined) {
				throw new InternalApiError(
					400,
					'Your account is not verified. Go to minemaker.net/link to link your Minecraft account, then try again.'
				);
			}

			return authResult as { authenticated: true; uuid: string; id?: string };
		} else {
			throw new InternalApiError(400, 'Unauthorized');
		}
	});

type AuthResult =
	| { authenticated: false }
	| {
			authenticated: true;
			id?: string;
			uuid?: string;
	  };

const checkToken = async (
	token: string,
	jwt: {
		sign?: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
		verify: any;
	}
): Promise<AuthResult> => {
	const userData = await jwt.verify(token);

	if (!userData) {
		return {
			authenticated: false
		};
	}

	return {
		authenticated: true,
		uuid: userData.uuid,
		id: userData.id
	};
};
