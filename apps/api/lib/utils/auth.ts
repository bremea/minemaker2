import { Elysia } from 'elysia';
import { jwt, JWTPayloadSpec } from '@elysiajs/jwt';
import { InternalApiError } from '@minemaker/types';
import { checkUserVerified, getUser } from '@minemaker/db';

export const blockAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve({ as: 'scoped' }, async ({ headers, jwt, set }) => {
		const result = await checkToken(headers, jwt);

		if (result.authenticated) {
			return result;
		} else {
			throw new InternalApiError(400, 'Unauthorized');
		}
	});

export const blockVerified = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve({ as: 'scoped' }, async ({ headers, jwt, set }) => {
		const result = await checkToken(headers, jwt);

		if (result.authenticated) {
			if (result.uuid == undefined || result.id == undefined) {
				throw new InternalApiError(
					400,
					'Your account is not verified. Go to minemaker.net/link to link your Minecraft account, then try again.'
				);
			}

			return result as { authenticated: true; uuid: string; id: string };
		} else {
			throw new InternalApiError(400, 'Unauthorized');
		}
	});

export const blockGuest = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve({ as: 'scoped' }, async ({ headers, jwt, set }) => {
		const result = await checkToken(headers, jwt);

		if (result.authenticated) {
			if (result.uuid != undefined && result.id == undefined) {
				throw new InternalApiError(
					400,
					'Your account is not verified. Go to minemaker.net/link to link your Minecraft account, then try again.'
				);
			}

			return result as { authenticated: true; uuid?: string; id: string };
		} else {
			throw new InternalApiError(400, 'Unauthorized');
		}
	});

export const blockNonGuest = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve({ as: 'scoped' }, async ({ headers, jwt, set }) => {
		const result = await checkToken(headers, jwt);

		if (result.authenticated) {
			if (result.uuid == undefined) {
				throw new InternalApiError(
					400,
					'Your account is not verified. Go to minemaker.net/link to link your Minecraft account, then try again.'
				);
			}

			return result as { authenticated: true; uuid: string; id?: string };
		} else {
			throw new InternalApiError(400, 'Unauthorized');
		}
	});

export const checkAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve({ as: 'scoped' }, async ({ headers, jwt }) => {
		return { auth: await checkToken(headers, jwt) };
	});

type AuthResult =
	| { authenticated: false }
	| {
			authenticated: true;
			id?: string;
			uuid?: string;
	  };

const checkToken = async (
	headers: Record<string, string | undefined>,
	jwt: {
		sign?: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
		verify: any;
	}
): Promise<AuthResult> => {
	if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
		return {
			authenticated: false
		};
	}

	const token = headers.authorization.substring(7, headers.authorization.length);
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
