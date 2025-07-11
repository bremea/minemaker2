import { connect, type NatsConnection } from '@nats-io/transport-node';

export const natsConnection = await connect();

export * from './types';
