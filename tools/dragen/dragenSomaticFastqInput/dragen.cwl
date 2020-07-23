cwlVersion: v1.1
class: CommandLineTool

hints:
  - class: ResourceRequirement
    coresMin: 8
    ilmn-tes:resources:
        type: fpga
        size: medium
  - class: DockerRequirement
    dockerPull: '699120554104.dkr.ecr.us-east-1.amazonaws.com/stratus/dragen:3.5.2'
  - class: InlineJavascriptRequirement
  - class: ShellCommandRequirement

baseCommand: ["/opt/edico/bin/dragen"]

arguments:
  - valueFrom: |-
      --partial-reconfig DNA-MAPPER --ignore-version-check true && \\
      mkdir -p /ephemeral/ref && \\
      tar -C /ephemeral/ref -xvf "$(inputs.refdata.path)" && \\
      mkdir "$(inputs.outdir)" && \\
      /opt/edico/bin/dragen --lic-instance-id-location /opt/instance-identity -f -r /ephemeral/ref -1 "$(inputs.fq_n1.path)" -2 "$(inputs.fq_n2.path)" --RGID "$(inputs.rgid_n)" --RGSM "$(inputs.rgsm_n)" --tumor-fastq1 "$(inputs.fq_t1.path)" --tumor-fastq2 "$(inputs.fq_t2.path)" --RGID-tumor "$(inputs.rgid_t)" --RGSM-tumor "$(inputs.rgsm_t)" --output-file-prefix "$(inputs.outprefix)" --output-directory "$(inputs.outdir)" --enable-duplicate-marking true --enable-map-align-output true --enable-variant-caller true --enable-sv true
    shellQuote: false

inputs:
  refdata:
    type: File
  fq_t1:
    type: File
  fq_t2:
    type: File
  fq_n1:
    type: File
  fq_n2:
    type: File
  rgid_t:
    type: string
  rgsm_t:
    type: string
  rgid_n:
    type: string
  rgsm_n:
    type: string
  outprefix:
    type: string
  outdir:
    type: string

outputs:
  dragenSomaticOutput:
    type: Directory
    outputBinding:
      glob: "$(inputs.outdir)"

  dragenBAM:
    type: File
    outputBinding:
      glob: "$(inputs.outdir)/$(inputs.outprefix).bam"

$namespaces:
  ilmn-tes: http://platform.illumina.com/rdf/iap/