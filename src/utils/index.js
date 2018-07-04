// @flow
/**
 * General utilities
 * @namespace Utils
 * @public
 */
module.exports.credsFromQueryFullFetch = require("./creds-from-query-full-fetch");
module.exports.credsFromQueryFullBody = require("./creds-from-query-full-body");

module.exports.staticRouter = require("./static-router");
module.exports.PromiseReuser = require("./promise-reuser");
module.exports.onExit = require("./on-exit");

module.exports.notificationDefaultFlowControl = require("./notification-default-flow-control");
module.exports.NotificationValidator = require("./notification-validator");

module.exports.superagentUrlTemplatePlugin = require("./superagent-url-template-plugin");
module.exports.superagentInstrumentationPlugin = require("./superagent-intrumentation-plugin.js");
module.exports.superagentErrorPlugin = require("./superagent-error-plugin.js");

module.exports.devMode = require("./dev-mode");
