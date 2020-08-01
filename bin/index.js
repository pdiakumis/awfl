#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const cwl = require("../src/cwl");
const { description, version } = require("../package.json");
const { program } = require("@caporal/core");

program
  .description(description)
  .version(version)
  .command("cwl", "CWL-related functionality")
  .argument("<cwl>", "Path to CWL file")
  .option("-v, --versionName <string>", "Name of workflow version", {
    default: "version1",
  })
  .option("-l, --launchName <string>", "Name of workflow launch", {
    default: "launch1",
  })
  .action(({ logger, args, options }) => {
    logger.info(
      `CWL file: ${args.cwl}\nLaunchName: ${options.launchName}\nVersionName: ${options.versionName}`
    );
    // cwl.write_workflow_json(cli.cwl, cli.versionName, cli.launchName);
  })

  .command("run", "Run workflows")
  .argument("<workflowName>", "Name of workflow version to run.")
  .action(({ logger, args, options }) => {
    logger.info(`Workflow name: ${args.workflowName}`);
  });
program.run();

module.exports = {
  argv: program,
};
