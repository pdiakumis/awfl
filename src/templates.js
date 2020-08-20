"use strict";

const LAUNCH_TEMPLATE = {
  dragenGermline: d => {
    if (!d.hasOwnProperty("sample")) {
      throw new Error(`No 'sample' key found!`);
    }
    if (!d.hasOwnProperty("phenotype")) {
      throw new Error(`No 'phenotype' key found!`);
    }
    let phenos = ["tumor", "normal"];
    if (!phenos.includes(d.phenotype)) {
      throw new Error(`${d.phenotype} should be one of ${phenos.join(", ")}`);
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
};

const WORKFLOWS = {
  dragenGermline: {
    workflowId: "wfl.88eebd2526e64efab40fdc5491d35198",
    versionName: "dragenGermlineCsvInput",
  },
};

module.exports = {
  LAUNCH_TEMPLATE: LAUNCH_TEMPLATE,
  WORKFLOWS: WORKFLOWS,
};
