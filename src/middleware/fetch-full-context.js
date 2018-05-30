// @flow
import type { $Response, NextFunction } from "express";
import type { HullRequest } from "../types";


function fetchConnector(ctx): Promise<*> {
  if (ctx.connector) {
    return Promise.resolve(ctx.connector);
  }
  return ctx.cache.wrap("connector", () => {
    return ctx.client.get("app");
  });
}

function fetchSegments(ctx, entityType = "users") {
  if (ctx[`${entityType}_segments`]) {
    return Promise.resolve(ctx[`${entityType}_segments`]);
  }
  const { id } = ctx.client.configuration();
  return ctx.client.get(
    `/${entityType}_segments`,
    { shipId: id },
    {
      timeout: 5000,
      retry: 1000
    }
  );
}

/**
 * This middleware is responsible for fetching all information
 * using HullClient.
 */
function fetchFullContextMiddlewareFactory({ requestName }) {
  return function fetchFullContextMiddleware(req: HullRequest, res: $Response, next: NextFunction) {
    return Promise.all([
      fetchConnector(req.hull),
      fetchSegments(req.hull, "users"),
      fetchSegments(req.hull, "accounts")
    ]).then(([connector, usersSegments, accountsSegments]) => {
      const requestId = [requestName].join("-");
      req.hull = Object.assign({}, req.hull, {
        requestId,
        ship: connector,
        connector,
        segments: usersSegments,
        users_segments: usersSegments,
        accounts_segments: accountsSegments,
      });
      next();
    });
  };
}

module.exports = fetchFullContextMiddlewareFactory;
