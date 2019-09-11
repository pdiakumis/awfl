#!/usr/bin/env cwltool

cwlVersion: v1.0
class: CommandLineTool
baseCommand: tar
arguments: [-x, -v, -z, -f]
inputs:
  compress_file:
    type: File
    inputBinding:
      position: 1
    label: the file to be decompressed

outputs:
  uncompress_file:
    type: File
    outputBinding:
      glob: "*"

