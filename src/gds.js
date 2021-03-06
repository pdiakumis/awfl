#!/usr/bin/env node

"use strict";

const axios = require("axios").default;
const path = require("path");
const fs = require("fs").promises;
const shell = require("shelljs");
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
  let vName = getVolumeName(gdsFile);
  let vNameGds = `gds://${vName}`;
  let gdsPath = gdsFile.replace(vNameGds, "");
  let qs = {
    "volume.name": vName,
    path: gdsPath,
    include: "presignedurl",
  };
  let opts = requestOpts;
  opts.params = qs;
  opts.url = "/files";

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

/**
 * Generate presigned URLs for Read1File and Read2File in input CSV file.
 * Splits the provided CSV by Subject and Phenotype, then writes one CSV
 * per Phenotype into the Subject directory.
 * @param {string} inCsv Input CSV with Subject, Phenotype, RGID, RGSM, RGLB, Lane,
 * Read1File and Read2File columns.
 * @param {string} outDir Output directory to write the
 * updated CSV with presigned URLs in the Read1File and Read2File columns.
 */
async function generatePresignedUrlsCsv(inCsv, outDir) {
  try {
    const arrOfObj = utils.readCsv(inCsv);
    await Promise.all(
      arrOfObj.map(async o => {
        // Create <Subject> directory, and write CSVs
        const subject = o["Subject"];
        const subject_outdir = path.join(outDir, subject);
        const phenotype = o["Phenotype"].toLowerCase();
        shell.mkdir("-p", subject_outdir);

        const url1 = await getPresignedUrl(o["Read1File"]);
        const url2 = await getPresignedUrl(o["Read2File"]);
        let csv = "RGID,RGSM,RGLB,Lane,Read1File,Read2File\n";
        csv += `${o["RGID"]},${o["RGSM"]},${o["RGLB"]},${o["Lane"]},${url1},${url2}\n`;
        let outCsv = path.join(subject_outdir, `${subject}_${phenotype}.csv`);
        await fs.writeFile(outCsv, csv);
      })
    );
  } catch (error) {
    console.error(`Could not save entries to file: ${error}`);
  }
}

// function copyCsvToGds(csv, gds) {
//   shell.exec(`iap files upload ${csv} ${gds}`, {
//     silent: false,
//     fatal: true,
//     async: true,
//   });
// }

module.exports = {
  generatePresignedUrlsCsv: generatePresignedUrlsCsv,
};
