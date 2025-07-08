import { Elysia } from 'elysia';
import { autoload } from 'elysia-autoload';
import { jwt } from '@elysiajs/jwt';
import { Snowyflake } from 'snowyflake';
import { ip } from 'elysia-ip';
import { InternalApiError } from '@minemaker/types';

const app = new Elysia()
	.error({ InternalApiError })
	.onError(({ code, error, set, status }) => {
		if (process.env.DEVELOPMENT_MODE) {
			console.log(error);
		}

		switch (code) {
			case 'InternalApiError': {
				set.status = error.status;
				return { error: true, code: error.status, message: error.toString() };
			}
			case 'VALIDATION': {
				return { error: true, code: 422, message: error.message };
			}
			case 'NOT_FOUND': {
				return { error: true, code: 404, message: code };
			}
			default: {
				return { error: true, code: status, message: code };
			}
		}
	})
	.use(ip())
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
	.listen(3000);

export type ElysiaApp = typeof app;
