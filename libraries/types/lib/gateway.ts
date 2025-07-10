export enum GatewayOpCodes {
	DISPATCH = 0,
	HEARTBEAT = 1,
	HEARTBEAT_ACK = 2,
	HELLO = 3,
	IDENTIFY = 4,
	READY = 5,
	RESUME = 6
}

export type GatewayDispatchEventTypes = 'message' | 'friendRequest';

export interface GatewayEvent<T = unknown> {
	op: GatewayOpCodes;
	d?: T;
	s?: number;
	t?: string;
}

export interface GatewayDispatchEvent<T, E extends GatewayDispatchEventTypes>
	extends GatewayEvent<T> {
	op: GatewayOpCodes.DISPATCH;
	d: T;
	s: number;
	t: E;
}

export interface GatewaySendEvent<T> {
	op: number;
	d?: T;
}

/** Hello (receive) */
export type GatewayHelloEventData = {
	heartbeatInterval: number;
};

export interface GatewayHelloEvent extends GatewayEvent<GatewayHelloEventData> {
	op: GatewayOpCodes.HELLO;
}

/** Client properties */
export type GatewayIdentifyClientProperties = {
	userAgent: string;
};

/** Identify (send) */
export type GatewayIdentifyEventData = {
	token: string;
	subscriptions: string[];
	properties: GatewayIdentifyClientProperties;
};

export interface GatewayIdentifySendEvent extends GatewaySendEvent<GatewayIdentifyEventData> {
	op: GatewayOpCodes.IDENTIFY;
}

/** Heartbeat Send - d should be last sequence number received (or null if none yet) */
export type GatewayHeartbeatEventData = number | null;

export interface GatewayHeartbeatSendEvent extends GatewaySendEvent<GatewayHeartbeatEventData> {
	op: GatewayOpCodes.HEARTBEAT;
}

/** Heartbeat Ack */
export interface GatewayHeartbeatAckEvent extends GatewayEvent<undefined> {
	op: GatewayOpCodes.HEARTBEAT_ACK;
}

/** Ready Event (receive) */
export type GatewayReadyEventData = {
	sessionId: string;
	reconnectUrl: string;
};

export interface GatewayReadyEvent extends GatewayEvent<GatewayReadyEventData> {
	op: GatewayOpCodes.READY;
}

/** Message Event (receive) */
export type GatewayMessageEventData = {
	content: string;
	author: string;
};

export type GatewayMessageEvent = GatewayDispatchEvent<GatewayMessageEventData, 'message'>;
