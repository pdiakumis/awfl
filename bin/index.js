#!/usr/bin/env node
"use strict";

const cwl = require("../src/cwl");
const gds = require("../src/gds");
const run = require("../src/run");
const { description, version } = require("../package.json");
const { program } = require("@caporal/core");
const templates = require("../src/templates");
const chalk = require("chalk");

const allowed_workflows = Object.keys(templates.WORKFLOWS);

program
  .description(description)
  .version(version)

  // cwl
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
    cwl.writeWorkflowJson(args.cwl, options.versionName, options.launchName);
  })

  // csvgen
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
    logger.info(`Generating presigned URLs for ${args.inputCsv}`);
    logger.info(`Results will be written to: ${args.outDir}`);
    gds.generatePresignedUrlsCsv(args.inputCsv, args.outDir);
  })

  // run
  .command("run", "Run workflow.")
  .argument("<workflowName>", "Workflow name.", {
    validator: allowed_workflows,
  })
  .option("-s, --sample <string>", "Sample name.")
  .option("-p, --phenotype <string>", "Phenotype.")
  .action(({ logger, args, options }) => {
    logger.info(
      `Running workflow ${chalk.yellow(args.workflowName)} ` +
        `for sample ${chalk.yellow(options.sample)} ` +
        `and phenotype ${chalk.yellow(options.phenotype)}.`
    );
    run.launchWorkflow(args.workflowName, {
      sample: options.sample,
      phenotype: options.phenotype,
    });
  });
program.run();
