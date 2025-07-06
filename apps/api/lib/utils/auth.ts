import { Elysia, t } from 'elysia';
import { jwt, JWTPayloadSpec } from '@elysiajs/jwt';

export const blockAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve({ as: 'scoped' }, async ({ headers, error, jwt }) => {
		const result = await checkToken(headers, jwt);

		if (result.authenticated) {
			return result;
		} else {
			return error(401, { error: true, code: 'UNAUTHORIZED' });
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

type AuthResult = { authenticated: true; uuid: string } | { authenticated: false; uuid: null };

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
			uuid: null
		};
	}

	const token = headers.authorization.substring(7, headers.authorization.length);
	const userData = await jwt.verify(token);

	if (!userData) {
		return {
			authenticated: false,
			uuid: null
		};
	}

	return {
		authenticated: true,
		uuid: userData.uuid as string
	};
};
