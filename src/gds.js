#!/usr/bin/env node

const axios = require("axios").default;
const utils = require("./utils");
const requestOpts = require("./illumina").requestOpts;
const utils = require("./utils");

/**
 * Get the volume name from a GDS file path input.
 * @param {string} gdsFile GDS file path.
 * @returns {string} The volume portion of the GDS file path input.
 */
const getVolumeName = function (gdsFile) {
  let re = new RegExp("^gds://");
  if (typeof gdsFile !== "string" || !re.test(gdsFile)) {
    return new Error(
      `${gdsFile} needs to be a string that starts with 'gds://'!`
    );
  }

  // gds://foo/bar -> ['gds:', '', 'foo', 'bar']
  let v = gdsFile.split("/")[2];
  return v;
};

/**
 * GET a promise of the presignedUrl of a GDS file path.
 * @param {string} gdsFile GDS file path.
 */
async function getPresignedUrl(gdsFile) {
  let opts = requestOpts;
  let vName = getVolumeName(gdsFile);
  let vNameGds = `gds://${vName}`;
  let gdsPath = gdsFile.replace(vNameGds, "");
  let qs = {
    "volume.name": vName,
    path: gdsPath,
    include: "presignedurl",
  };
  opts.url = "/files";
  opts.params = qs;

  try {
    let r = await axios(opts);
    let d = r.data;
    if (d.hasOwnProperty("items") && d.items.length === 1) {
      if (!d.items[0].hasOwnProperty("presignedUrl")) {
        throw new Error(`Couldn't find presignedUrl for ${gdsFile}!`);
      }
      return d.items[0].presignedUrl;
    } else {
      throw new Error(
        `Response does not have an 'items' key with a value of length 1!`
      );
    }
  } catch (error) {
    utils.printError(error);
  }
}

module.exports = {
  getPresignedUrl: getPresignedUrl,
};
