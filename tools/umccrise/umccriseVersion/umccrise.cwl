cwlVersion: v1.1
class: CommandLineTool

hints:
  - class: ResourceRequirement
    coresMin: 2
    ramMin: 1024
    ilmn-tes:resources:
        type: standard
        size: medium
  - class: DockerRequirement
    dockerPull: '843407916570.dkr.ecr.ap-southeast-2.amazonaws.com/umccrise:1.0.9-bfab109526'
  - class: InlineJavascriptRequirement
  - class: ShellCommandRequirement

baseCommand: ["umccrise"]

arguments:
  - valueFrom: |-
      --version > version.txt 2>&1
    shellQuote: false

inputs: {}

outputs:
  version_file:
    type: File
    outputBinding:
      glob: "version.txt"

$namespaces:
  ilmn-tes: http://platform.illumina.com/rdf/iap/
