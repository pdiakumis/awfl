#!/usr/bin/env cwl-runner

cwlVersion: v1.0
class: Workflow
inputs:
  zip_file:
    type: File
  search_string:
    type: string
  output_filename: 
    type: string?

requirements:
  MultipleInputFeatureRequirement: {}

steps:
  untar:
    run: ../tools/tar.cwl
    in:
      compress_file:
        source: zip_file
    out: [uncompress_file]
  grep:
    run: ../tools/grep.cwl
    in:
      extended:
        default: true
      search_file:
        source: untar/uncompress_file
      search_string: search_string
    out: [occurences]
  wc:
    run: ../tools/wc.cwl
    in:
      input_file: grep/occurences
      output_filename: output_filename
    out: [count]

outputs:
  occurences:
    type: File
    outputSource: [wc/count]

