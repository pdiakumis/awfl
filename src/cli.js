"use strict";

const program = require("commander");
const { description, version } = require("../package.json");
const fs = require("fs");

const argv = program
  .version(version, "-V, --version", "Version of awfl")
  .description(description)
  .requiredOption("-c, --cwl <file>", "Path to CWL file")
  .option("-v, --versionName <string>", "Name of workflow version", "version1")
  .option("-l, --launchName <string>", "Name of workflow launch", "launch1")
  .parse(process.argv);

module.exports = {
  argv: argv,
};
