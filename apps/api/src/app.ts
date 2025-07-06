import { Elysia } from 'elysia';
import { autoload } from 'elysia-autoload';
import { jwt } from '@elysiajs/jwt';
import { Epoch, Snowyflake } from 'snowyflake';

const app = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.JWT_SECRET!,
			exp: '1h'
		})
	)
	.decorate(
		'snowflake',
		new Snowyflake({
			workerId: BigInt(process.env.WORKER_ID!),
			epoch: BigInt(1588651200000)
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
