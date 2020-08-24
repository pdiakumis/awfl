"use strict";

const utils = require("./utils");

const LAUNCH_TEMPLATE = {
  dragenGermline: d => {
    if (!d.hasOwnProperty("sample")) {
      throw new Error(`LAUNCH_TEMPLATE: No 'sample' key found!`);
    }
    if (!d.hasOwnProperty("phenotype")) {
      throw new Error(`LAUNCH_TEMPLATE: No 'phenotype' key found!`);
    }
    let phenos = ["tumor", "normal"];
    if (!phenos.includes(d.phenotype)) {
      throw new Error(
        `LAUNCH_TEMPLATE: Phenotype should be one of ` +
          `'${phenos.join(", ")}', NOT ${d.phenotype}!`
      );
    }
    let obj = {
      Name: `dragenGermline_${d.sample}_${d.phenotype}`,
      Input: {
        refdata: {
          class: "File",
          location: "gds://umccr-refdata-dev/dragen/hsapiens/hg38/3.6.3_ht.tar",
        },
        outprefix: d.sample,
        outdir: d.sample,
        fqcsv: {
          class: "File",
          location: `gds://diakumis-dragen/fastq_csv_input/${d.sample}/${d.sample}_${d.phenotype}.csv`,
        },
      },
    };
    return obj;
  },

  dragenSomatic: d => {
    if (!d.hasOwnProperty("sample")) {
      throw new Error(`No 'sample' key found!`);
    }

    let obj = {
      Name: `dragenSomatic_${d.sample}`,
      Input: {
        refdata: {
          class: "File",
          location: "gds://umccr-refdata-dev/dragen/hsapiens/hg38/3.6.3_ht.tar",
        },
        outprefix: d.sample,
        outdir: d.sample,
        fqcsv_tumor: {
          class: "File",
          location: `gds://diakumis-dragen/fastq_csv_input/${d.sample}/${d.sample}_tumor.csv`,
        },
        fqcsv_normal: {
          class: "File",
          location: `gds://diakumis-dragen/fastq_csv_input/${d.sample}/${d.sample}_normal.csv`,
        },
      },
    };
    return obj;
  },

  umccrise: d => {
    if (!d.hasOwnProperty("sample")) {
      throw new Error(`No 'sample' key found!`);
    }
    if (!d.hasOwnProperty("dragenResults")) {
      throw new Error(`No 'dragenResults' key found!`);
    }

    let obj = {
      Name: `umccrise_1.0.9_${d.sample}`,
      Input: {
        outDir: d.sample,
        genomeDir: {
          class: "Directory",
          location: "gds://umccr-refdata-dev/umccrise/genomes/",
        },
        dragenResultsDir: {
          class: "Directory",
          location: d.dragenResults,
        },
      },
    };
    return obj;
  },
};

const WORKFLOWS = {
  dragenGermline: {
    workflowId: "wfl.88eebd2526e64efab40fdc5491d35198",
    versionName: "dragenGermlineCsvInput",
  },
  dragenSomatic: {
    workflowId: "wfl.126aeca88a614aa5a5cacd470a47136b",
    versionName: "dragenSomaticCsvInput",
  },
  umccrise: {
    workflowId: "wfl.d958e72cc62943738a0d6db6820b1503",
    versionName: "umccriseRun",
  },
};

module.exports = {
  LAUNCH_TEMPLATE: LAUNCH_TEMPLATE,
  WORKFLOWS: WORKFLOWS,
};
