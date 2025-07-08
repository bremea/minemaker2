import { Elysia } from 'elysia';
import { jwt, JWTPayloadSpec } from '@elysiajs/jwt';
import { InternalApiError } from '@minemaker/types';

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

export const checkAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve({ as: 'scoped' }, async ({ headers, jwt }) => {
		const result = await checkToken(headers, jwt);

		return result;
	});

type AuthResult = { authenticated: true; id: string } | { authenticated: false; id: null };

const checkToken = async (
	headers: Record<string, string | undefined>,
	jwt: {
		sign?: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
		verify: any;
	}
): Promise<AuthResult> => {
	if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
		return {
			authenticated: false,
			id: null
		};
	}

	const token = headers.authorization.substring(7, headers.authorization.length);
	const userData = await jwt.verify(token);

	if (!userData) {
		return {
			authenticated: false,
			id: null
		};
	}

	return {
		authenticated: true,
		id: userData.id as string
	};
};
