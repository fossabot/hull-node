/**
 * The middleware which ensures that the Hull Client was successfully setup by the Hull.Middleware:
 * @return {[type]} [description]
 */
module.exports = function requireHullMiddlewareFactory() {
  return function requireHullMiddleware(req, res, next) {
    if (!req.hull || !req.hull.client) {
      return res.status(403).send("Missing credentials. Set one of token or hullToken or set of ship, organization, secret");
    }
    return next();
  };
};
