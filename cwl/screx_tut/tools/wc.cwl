#!/usr/bin cwltool

cwlVersion: v1.0
class: CommandLineTool
baseCommand: wc
requirements:
  InlineJavascriptRequirement: {}

stdout: $(inputs.output_filename)
arguments: ["-l"]

inputs:
  input_file:
    type: File
    streamable: true
    inputBinding:
      position: 1
  output_filename:
    type: string?
    inputBinding:
      position: 2
    default: count.txt

outputs:
  count:
    type: stdout

