import _ from "lodash";

import { PromiseReuser } from ".";

/**
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export default function segmentsMiddlewareFactory() {
  const promiseReuser = new PromiseReuser();
  return function segmentsMiddleware(req, res, next) {
    req.hull = req.hull || {};

    if (!req.hull.client) {
      return next();
    }

    const { cache, message, connectorConfig } = req.hull;
    const bust = (message
      && (message.Subject === "users_segment:update" || message.Subject === "users_segment:delete"));

    return (() => {
      if (bust) {
        return cache.del("segments");
      }
      return Promise.resolve();
    })().then(() => {
      const reusableGet = promiseReuser.reusePromise((shipId) => { // eslint-disable-line no-unused-vars
        return cache.wrap("segments", () => {
          return req.hull.client.get("/segments", {}, {
            timeout: 5000,
            retry: 1000
          });
        });
      });
      return reusableGet(req.hull.ship.id);
    }).then((segments) => {
      req.hull.segments = _.map(segments, (s) => {
        const fieldName = connectorConfig.segmentFilterSetting;
        const fieldPath = `ship.private_settings.${fieldName}`;
        if (_.has(req.hull, fieldPath)) {
          s.filtered = _.includes(_.get(req.hull, fieldPath, []), s.id);
        }
        return s;
      });
      return next();
    }, () => next());
  };
}
