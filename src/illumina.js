"use strict";

const yaml = require("js-yaml");
const path = require("path");
const os = require("os");
const fs = require("fs");
const utils = require("./utils");

const BASE_URL = "https://aps2.platform.illumina.com/v1";

const token = (function () {
  let token;
  token = process.env.IAP_TOKEN;
  if (!token) {
    try {
      let session_file = path.join(os.homedir(), ".iap/.session.yaml");
      token = yaml.safeLoad(fs.readFileSync(session_file, "utf8"));
      token = token["access-token"];
    } catch (e) {
      utils.printError(e);
    }
  }
  return token;
})();

const requestOpts = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  baseURL: BASE_URL,
};

module.exports = {
  requestOpts: requestOpts,
};
