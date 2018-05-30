const path = require("path");
const express = require("express");

function manifestRouteFactory(dirname) {
  return function manifestRoute(req, res) {
    return res.sendFile(path.resolve(dirname, "..", "manifest.json"));
  };
}

function readmeRoute(req, res) {
  return res.redirect(`https://dashboard.hullapp.io/readme?url=https://${req.headers.host}`);
}

module.exports = function staticRouter() {
  const router = express.Router();

  router.use(express.static(`${process.cwd()}/dist`));
  router.use(express.static(`${process.cwd()}/assets`));

  router.get("/manifest.json", manifestRouteFactory(`${process.cwd()}/dir`));
  router.get("/", readmeRoute);
  router.get("/readme", readmeRoute);

  return router;
};
