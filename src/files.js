"use strict";

const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const yaml = require("js-yaml");

/**
 * Check if cwltool is on PATH. Exit if not.
 * @returns {boolean} false if not in PATH.
 */
const cwltool_in_path = function () {
  if (!shell.which("cwltool")) {
    console.error(chalk.red("cwltool not found in PATH!"));
    return false;
  }
  console.log(chalk.green("cwltool found in PATH!"));
  return true;
};

/**
 * Check if CWL file exists and has a '.cwl' suffix.
 * @param {string} cwl Path to CWL original file.
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
 * @param {string} cwl Path to CWL original file.
 */
const cwltool_validate = function (cwl) {
  console.log(chalk.yellow("Validating CWL file"));
  if (!cwl_file_exists(cwl) || !cwltool_in_path()) {
    process.exit(1);
  }
  shell.exec(`cwltool --validate ${cwl}`, { silent: false, fatal: true });
};

/**
 * Convert CWL file into a packed JSON file.
 * @param {string} cwl Path to CWL original file.
 * @returns {object} Object containing 'path' to packed CWL, and the actual JSON object 'json'.
 */
const cwltool_pack = function (cwl) {
  cwltool_validate(cwl);
  console.log(chalk.yellow("Packing CWL file"));

  let cwl_dirname = path.dirname(cwl);
  let cwl_base = path.parse(cwl).name;
  let cwl_packed = path.join(cwl_dirname, cwl_base) + "-packed.cwl";

  let cmd = shell.exec(`cwltool --pack ${cwl}`, {
    silent: true,
    fatal: true,
  });

  try {
    console.log(chalk.yellow(`Writing packed CWL file to ${cwl_packed}`));
    fs.writeFileSync(cwl_packed, cmd.stdout);
  } catch (err) {
    console.error(chalk.red(err));
  }
  return {
    path: cwl_packed,
    json: cmd.stdout,
  };
};

/**
 * Generate CWL template input object.
 * @param {string} cwl Path to CWL original file.
 * @returns {string} Output YAML from 'cwltool --make-template <cwl>'
 */
const cwltool_make_template = function (cwl) {
  console.log(chalk.yellow("Generating CWL template input object"));

  let cmd = shell.exec(`cwltool --make-template ${cwl}`, {
    silent: true,
    fatal: true,
  });

  return cmd.stdout;
};

/**
 *
 * @param {string} cwl Path to CWL original file.
 * @param {string} launchName Workflow launch name.
 */
const write_workflow_launch = function (cwl, launchName) {
  // write to path/to/cwl/json/launchName.json
  let input_yaml = cwltool_make_template(cwl);
  let json_path = path.join(path.dirname(cwl), "json", launchName + ".json");

  try {
    console.log(
      chalk.yellow(`Writing jsonised CWL template input object to ${json_path}`)
    );
    let yaml2json = yaml.safeLoad(input_yaml);
    let output_json = {
      Name: launchName,
      Input: yaml2json,
    };
    output_json = JSON.stringify(output_json, null, 4);
    fs.writeFileSync(json_path, output_json);
  } catch (err) {
    console.error(chalk.red(err));
  }
};

/**
 * @param {string} cwl Path to CWL original file.
 * @param {string} versionName Workflow version name.
 */
const write_workflow_version = function (cwl, versionName) {
  // write to path/to/cwl/json/versionName.json
  let cwl_packed = JSON.parse(cwltool_pack(cwl).json);
  let json_path = path.join(path.dirname(cwl), "json", versionName + ".json");

  var json_template = {
    Version: versionName,
    Language: {
      Name: "cwl",
    },
    Definition: cwl_packed,
  };

  var workflow_version_json = JSON.stringify(json_template, null, 4);

  try {
    console.log(chalk.yellow(`Writing workflow version file to ${json_path}`));

    fs.writeFileSync(json_path, workflow_version_json);
  } catch (err) {
    console.error(chalk.red(err));
  }
};

/**
 * Generate required JSON files for running IAP CWL workflows.
 * @param {string} cwl Path to CWL original file.
 * @param {string} versionName Workflow version name.
 * @param {string} launchName Workflow launch name.
 */
const write_workflow_json = function (cwl, versionName, launchName) {
  write_workflow_version(cwl, versionName);
  write_workflow_launch(cwl, launchName);
};

module.exports = {
  write_workflow_json: write_workflow_json,
};
