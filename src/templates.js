"use strict";

const LAUNCH_TEMPLATE = {
  dragenGermline: sample => {
    let obj = {
      Name: `dragenGermline_${sample}`,
      Input: {
        refdata: {
          class: "File",
          location: "gds://umccr-refdata-dev/dragen/hsapiens/hg38/3.6.3_ht.tar",
        },
        outprefix: sample,
        outdir: sample,
        fqcsv: {
          class: "File",
          location: `gds://diakumis-dragen/fastq_csv_input/${sample}_fastqInputsUrls.csv`,
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
