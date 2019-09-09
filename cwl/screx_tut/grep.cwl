#!/usr/bin/env cwltool

cwlVersion: v1.0
class: CommandLineTool
baseCommand: grep
stdout: grep_results.txt
inputs:
  extended:
    type: boolean?
    inputBinding:
      position: 1
      prefix: -e
  search_string:
    type: string
    label: The string to look for in search_file
    inputBinding:
      position: 2
  search_file:
    type: File
    label: The file to search
    inputBinding:
      position: 3
outputs:
  occurences:
    type: stdout

