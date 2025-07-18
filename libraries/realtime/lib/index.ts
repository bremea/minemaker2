import { connect } from '@nats-io/transport-node';

export const natsConnection = await connect();

export * from './types';
export * from './queries';
export * from './utils';