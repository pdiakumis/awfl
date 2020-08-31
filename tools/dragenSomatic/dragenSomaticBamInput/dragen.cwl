cwlVersion: v1.1
class: CommandLineTool

hints:
  - class: ResourceRequirement
    coresMin: 8
    ilmn-tes:resources:
        type: fpga
        size: medium
  - class: DockerRequirement
    dockerPull: '699120554104.dkr.ecr.us-east-1.amazonaws.com/public/dragen:3.6.3'
  - class: InlineJavascriptRequirement
  - class: ShellCommandRequirement

baseCommand: ["/opt/edico/bin/dragen"]

arguments:
  - valueFrom: |-
      --partial-reconfig DNA-MAPPER --ignore-version-check true && \\
      mkdir -p /ephemeral/ref && \\
      tar -C /ephemeral/ref -xvf "$(inputs.refdata.path)" && \\
      mkdir "$(inputs.outdir)" && \\
      /opt/edico/bin/dragen --lic-instance-id-location /opt/instance-identity -f -r /ephemeral/ref --bam-input "$(inputs.bam_normal.path)" --tumor-bam-input "$(inputs.bam_tumor.path)" --output-file-prefix "$(inputs.outprefix)" --output-directory "$(inputs.outdir)" --enable-map-align false --enable-variant-caller true --enable-sv true
    shellQuote: false

inputs:
  refdata:
    type: File
  bam_normal:
    type: File
  bam_tumor:
    type: File
  outprefix:
    type: string
  outdir:
    type: string

outputs:
  dragenSomaticOutput:
    type: Directory
    outputBinding:
      glob: "$(inputs.outdir)"

  dragenVcf:
    type: File
    outputBinding:
      glob: "$(inputs.outdir)/$(inputs.outprefix).vcf.gz"

$namespaces:
  ilmn-tes: http://platform.illumina.com/rdf/iap/