#!/usr/bin/env cwl-runner

cwlVersion: v1.1
class: CommandLineTool

label: echo-stdout
doc: |-
  Simple echo to stdout

requirements:
  ResourceRequirement:
    ramMin: 256
    coresMin: 1
  DockerRequirement:
    dockerPull: 'alpine:latest'
  ShellCommandRequirement: {}

baseCommand: [ "echo" ]

arguments:
  - valueFrom: "$(inputs.message_in)"
  - valueFrom: "1> message.txt"
    shellQuote: false

inputs:
  message_in:
    type: string
    label: Message to output

outputs:
  message_out:
    type: File
    label: output to stdout
    outputBinding:
      glob: "message.txt"
