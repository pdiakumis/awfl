#!/usr/bin/env node

const axios = require("axios").default;
const path = require("path");
const fs = require("fs").promises;
const utils = require("./utils");
const requestOpts = require("./illumina").requestOpts;

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

async function savePresignedUrls(inCsv, outCsv) {
  try {
    const arrOfObj = utils.readCsv(inCsv);
    let csv = "RGID,RGSM,RGLB,Lane,Read1File,Read2File\n";
    await Promise.all(
      arrOfObj.map(async o => {
        const url1 = await getPresignedUrl(o["Read1File"]);
        const url2 = await getPresignedUrl(o["Read2File"]);
        csv += `${o["RGID"]},${o["RGSM"]},${o["RGLB"]},${o["Lane"]},${url1},${url2}\n`;
      })
    );
    await fs.writeFile(outCsv, csv);
  } catch (error) {
    console.error(`Could not save entries to file: ${error}`);
  }
}

savePresignedUrls(
  path.join(__dirname, "./2020-07-30_samples28.csv"),
  "./foo.csv"
);

module.exports = {
  getPresignedUrl: getPresignedUrl,
};
