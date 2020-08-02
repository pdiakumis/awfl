#!/usr/bin/env node
"use strict";

const cwl = require("../src/cwl");
const gds = require("../src/gds");
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
    logger.info(`Running awfl cwl!`);
    cwl.write_workflow_json(args.cwl, options.versionName, options.launchName);
  })

  .command("csvgen", "Generate CSV FASTQ input for DRAGEN.")
  .argument(
    "<inputCsv>",
    "Input CSV with RGID, RGSM, RGLB, Lane, Read1File and Read2File columns."
  )
  .argument(
    "<outDir>",
    "Output directory to write the CSV with presigned URLs."
  )
  .action(({ logger, args, options }) => {
    logger.info(`Generating presigned URLs!`);
    gds.generatePresignedUrls(args.inputCsv, args.outDir);
  });
program.run();
