#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const cli = require("../src/cli").argv;

console.log(chalk.green("CWL file: ") + cli.cwl);
console.log(chalk.red("Output file: ") + cli.output);

if (!shell.which("cwltool")) {
  console.error("[ERROR] this script requires cwltool to be on your PATH!");
  shell.exit(1);
}

console.log("cwltool version:");
shell.exec("cwltool --version", {
  silent: false,
});
