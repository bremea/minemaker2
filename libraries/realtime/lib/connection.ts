import { connect } from '@nats-io/transport-node';

export const connection = await connect();
console.log(`connected`);
