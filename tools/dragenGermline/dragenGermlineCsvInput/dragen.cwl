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
      /opt/edico/bin/dragen --lic-instance-id-location /opt/instance-identity -f -r /ephemeral/ref --fastq-list "$(inputs.fqcsv.path)" --output-file-prefix "$(inputs.outprefix)" --output-directory "$(inputs.outdir)" --enable-duplicate-marking true --enable-map-align-output true --enable-variant-caller true
    shellQuote: false

inputs:
  refdata:
    type: File
  fqcsv:
    type: File
  outprefix:
    type: string
  outdir:
    type: string

outputs:
  dragenGermlineOutput:
    type: Directory
    outputBinding:
      glob: "$(inputs.outdir)"

  dragenBAM:
    type: File
    outputBinding:
      glob: "$(inputs.outdir)/$(inputs.outprefix).bam"

$namespaces:
  ilmn-tes: http://platform.illumina.com/rdf/iap/