export type GatewayDispatchEventTypes = 'message' | 'friendRequest';

export interface GatewayEvent<T = unknown> {
	op: number;
	d?: T;
	s?: number;
	t?: string;
}

export interface GatewayDispatchEvent<T, E extends GatewayDispatchEventTypes>
	extends GatewayEvent<T> {
	op: 0;
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
	op: 3;
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
	op: 4;
}

/** Heartbeat Send - d should be last sequence number received (or null if none yet) */
export type GatewayHeartbeatEventData = number | null;

export interface GatewayHeartbeatSendEvent extends GatewaySendEvent<GatewayHeartbeatEventData> {
	op: 1;
}

/** Heartbeat Ack */
export interface GatewayHeartbeatAckEvent extends GatewayEvent<undefined> {
	op: 2;
}

/** Ready Event (receive) */
export type GatewayReadyEventData = {
	sessionId: string;
};

export interface GatewayReadyEvent extends GatewayEvent<GatewayReadyEventData> {
	op: 5;
}

/** Message Event (receive) */
export type GatewayMessageEventData = {
	content: string;
	author: string;
};

export type GatewayMessageEvent = GatewayDispatchEvent<GatewayMessageEventData, 'message'>;
