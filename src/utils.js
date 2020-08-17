"use strict";

const fs = require("fs");
const chalk = require("chalk");

const printError = function (e) {
  console.error(chalk.red(`THERE WAS AN ERROR \n${e}`));
};

/**
 * Read a CSV file into a Javascript object (synchronously). Removes empty lines.
 * @param {string} csv Input CSV
 */
const readCsv = function (csv) {
  let content = fs.readFileSync(csv, "utf-8");
  let lines = content.toString().split("\n").filter(Boolean);
  let headers = lines.shift().split(",");
  return lines.map(l => {
    let data = l.split(",");
    return headers.reduce((obj, nextKey, index) => {
      obj[nextKey] = data[index];
      return obj;
    }, {});
  });
};

module.exports = {
  readCsv: readCsv,
  printError: printError,
};
