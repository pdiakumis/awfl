"use strict";

const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");

/**
 * Check if cwltool is on PATH. Exit if not.
 */
const cwltool_on_path = function () {
  if (!shell.which("cwltool")) {
    console.error(chalk.red("cwltool required to be on your PATH!"));
    return false;
  }
  console.log(chalk.green("cwltool found on your PATH"));
  return true;
};

/**
 * Check if CWL file exists and has a '.cwl' suffix.
 * @param {string} cwl Path to CWL file.
 * @returns {boolean} true only if CWL exists and has a '.cwl' suffix.
 */
const cwl_file_exists = function (cwl) {
  if (!fs.existsSync(cwl)) {
    console.error(chalk.red(`CWL file ${cwl} does not exist.`));
    return false;
  }
  if (cwl.split(".").pop() !== "cwl") {
    console.error(chalk.red(`CWL file ${cwl} needs to have a 'cwl' suffix.`));
    return false;
  }
  return true;
};

/**
 * Validate CWL file. Checks if file exists, has a '.cwl' suffix, and that
 * cwltool is on PATH.
 * @param {string} cwl Path to CWL file.
 */
const cwltool_validate = function (cwl) {
  console.log(chalk.yellow("Validating CWL file"));
  if (!cwl_file_exists(cwl) || !cwltool_on_path()) {
    process.exit(1);
  }
  shell.exec(`cwltool --validate ${cwl}`, { silent: false, fatal: true });
};

/**
 *
 * @param {string} cwl Path to CWL file.
 */
const cwltool_pack = function (cwl) {
  cwltool_validate(cwl);
  console.log(chalk.yellow("Packing CWL file"));
};

module.exports = {
  cwltool_validate: cwltool_validate,
};
