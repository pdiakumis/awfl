#!/usr/bin/env node

"use strict";

const axios = require("axios").default;
const utils = require("./utils");
const requestOpts = require("./illumina").requestOpts;
const templates = require("./templates");

/**
 * Launches a specific workflow version given a workflow 'nickname'
 * and a data object. The data needs to conform to the specific workflow's
 * requirements.
 * @param {string} workflowName The nickname of the workflow.
 * @param {string} data Input data object.
 */
async function launchWorkflow(workflowName, data) {
  let wf = templates.WORKFLOWS[workflowName];
  let opts = requestOpts;
  opts.method = "post";
  opts.url = `/workflows/${wf.workflowId}/versions/${wf.versionName}:launch`;
  opts.data = templates.LAUNCH_TEMPLATE[workflowName](data);

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
