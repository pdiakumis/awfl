"use strict";

const program = require("commander");
const { description, version } = require("../package.json");

const argv = program
  .version(version)
  .description(description)
  .requiredOption("-c, --cwl <file>", "Path to CWL file")
  .requiredOption("-o, --output <file>", "Path ")
  .parse(process.argv);

module.exports = {
  argv: argv,
};
