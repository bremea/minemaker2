import { Elysia } from 'elysia';
import { autoload } from 'elysia-autoload';
import { jwt } from '@elysiajs/jwt';

const app = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.use(
		await autoload({
			prefix: '/api'
		})
	)
	.onError(({ code }) => {
		return { error: true, code: code };
	})
	.listen(3000);

export type ElysiaApp = typeof app;
