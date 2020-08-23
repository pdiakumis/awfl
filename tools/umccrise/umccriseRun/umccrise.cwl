cwlVersion: v1.1
class: CommandLineTool

hints:
  - class: ResourceRequirement
    ilmn-tes:resources:
        type: standardHiCpu
        size: medium
  - class: DockerRequirement
    dockerPull: '843407916570.dkr.ecr.ap-southeast-2.amazonaws.com/umccrise:1.0.9-bfab109526'
  - class: InlineJavascriptRequirement
  - class: ShellCommandRequirement

baseCommand: ["umccrise"]

inputs:
  dragenResultsDir:
    type: Directory
    inputBinding:
      position: 1
  genomeDir:
    type: Directory
    inputBinding:
      position: 2
      prefix: --genomes
  outDir:
    type: string
    inputBinding:
      position: 3
      prefix: -o

outputs:
  umccriseOutdir:
    type: Directory
    outputBinding:
      glob: "$(inputs.outDir)"

$namespaces:
  ilmn-tes: http://platform.illumina.com/rdf/iap/
