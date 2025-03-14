import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';

const verifyAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.resolve({ as: 'scoped' }, async ({ headers, error, jwt }) => {
		if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
			return error(401, 'Unauthorized');
		}

		const token = headers.authorization.substring(7, headers.authorization.length);
		const userData = await jwt.verify(token);

		if (!userData) {
			return error(401, 'Unauthorized');
		}

		return {
			uuid: userData.uuid as string
		};
	});

export default verifyAuth;
