#!/usr/bin/env node

"use strict";

const axios = require("axios").default;
const utils = require("./utils");
const requestOpts = require("./illumina").requestOpts;
const templates = require("./templates");

/**
 * Launches a specific workflow version.
 * @param {string} workflowName The nickname of the workflow
 * @param {string} sampleName Sample name. Just germline for now.
 */
async function launchWorkflow(workflowName, sampleName) {
  let wf = templates.WORKFLOWS[workflowName];
  let opts = requestOpts;
  opts.method = "post";
  opts.url = `/workflows/${wf.workflowId}/versions/${wf.versionName}:launch`;
  opts.data = templates.LAUNCH_TEMPLATE[workflowName](sampleName);

  try {
    let r = await axios(opts);
    console.log(r.data);
  } catch (error) {
    utils.printError(error);
  }
}

module.exports = {
  launchWorkflow: launchWorkflow,
};
