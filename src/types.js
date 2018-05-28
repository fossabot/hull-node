// @flow
import type { $Request, $Application } from "express";
import type {
  HullSegment, HullNotification, HullConnector, HullUserUpdateMessage, HullAccountUpdateMessage
} from "hull-client";

const HullClient = require("hull-client");
const ShipCache = require("./infra/cache/ship-cache");
const MetricAgent = require("./infra/instrumentation/metric-agent");
const { SmartNotifierResponse } = require("./utils/smart-notifier-response");

/**
 * @module Types
 */

/**
 * Context added to the express app request by hull-node connector sdk.
 * Accessible via `req.hull` param.
 * @public
 * @memberof Types
 */
export type HullReqContext = {
  requestId: string;
  config: Object;
  token: string;
  client: HullClient;
  ship: HullConnector; // since ship name is deprated we move it to connector param
  connector: HullConnector;
  hostname: string;
  options: Object;

  connectorConfig: Object;
  segments: Array<HullSegment>;
  users_segments: Array<HullSegment>;
  accounts_segments: Array<HullSegment>;
  cache: ShipCache;
  metric: MetricAgent;
  enqueue: (jobName: string, jobPayload?: Object, options?: Object) => Promise<*>;
  helpers: Object;
  service: Object;
  shipApp: Object;
  message?: Object;
  notification?: HullNotification;
  smartNotifierResponse: ?SmartNotifierResponse;
};

/*
 * Since Hull Middleware adds new parameter to the Reuqest object from express application
 * we are providing an extended type to allow using HullReqContext
 * @public
 * @memberof Types
 */
export type HullRequest = {
  ...$Request,
  hull: HullReqContext
};

// TODO: evolve this introducing envelope etc.
export type HullSendResponse = Promise<*>;
export type HullSyncResponse = Promise<*>;

// functional types
export type HullUserUpdateHandlerCallback = (ctx: HullReqContext, messages: Array<HullUserUpdateMessage>) => HullSendResponse;
export type HullAccountUpdateHandlerCallback = (ctx: HullReqContext, messages: Array<HullAccountUpdateMessage>) => HullSendResponse;
export type HullConnectorUpdateHandlerCallback = (ctx: HullReqContext) => HullSyncResponse;
export type HullSegmentUpdateHandlerCallback = (ctx: HullReqContext) => HullSyncResponse;

// OOP types
export interface HullSyncAgent {
  constructor(ctx: HullReqContext): void;
  sendUserUpdateMessages(messages: Array<HullUserUpdateMessage>): HullSendResponse;
  sendAccountUpdateMessages(messages: Array<HullAccountUpdateMessage>): HullSendResponse;
  syncConnectorUpdateMessage(): HullSyncResponse;
  syncSegmentUpdateMessage(): HullSyncResponse;
}

export type HullServerFunction = (app: $Application, extra?: Object) => $Application;

export type HullNotificationHandlerCallback =
  HullUserUpdateHandlerCallback |
  HullAccountUpdateHandlerCallback |
  HullConnectorUpdateHandlerCallback |
  HullSegmentUpdateHandlerCallback |
  $PropertyType<HullSyncAgent, 'sendUserUpdateMessages'> |
  $PropertyType<HullSyncAgent, 'sendAccountUpdateMessages'> |
  $PropertyType<HullSyncAgent, 'syncConnectorUpdateMessage'> |
  $PropertyType<HullSyncAgent, 'syncSegmentUpdateMessage'>;

export type HullNotificationChannelName =
  "user:update"
  | "account:update"
  | "ship:update"
  | "connector:update"
  | "segment:update"
  | "segment:delete";

export type HullNotificationHandlerConfiguration = {
  [HullNotificationChannelName]: HullNotificationHandlerCallback | {
    callback: HullNotificationHandlerCallback,
    options: Object
  }
};
