# CWL Notes

## CWL File Structure

- `cwlVersion`: version of CWL used (e.g. `v1.1`)
- `class`: class of program (`CommandLineTool`, `Workflow`)
- `baseCommand`: name of program that will run
- `inputs`: inputs of tool
  - include `id`, `type`, and `inputBinding` (optional)
    - `id`: name of param
    - `type`: types of valid values for param
      - primitive: `string`, `boolean`, `int`, `long`, `float`, `double`, `null`
      - complex: `array`, `record`
      - special: `File`, `Directory`, `Any`
    - `inputBinding`: how should this param appear on the command line
      - If missing, the param doesn't appear on the command line
- `outputs`: outputs of tool
  - include `id`, `type`
  - working directory is the designated output directory
  - `outputBinding`: how to set the value of each output param
  - `glob`: name of a file in the outdir. Use e.g. `*.txt` if name unknown in advance.
- `records`: relationships between programs/params
- `requirements`: dependencies of program
- `steps`: linking programs together into workflows

## Input YAML File

- `File`: requires `class` and `path`

## Tutorials

- [screx](https://github.com/screx/cwl-tutorial)
- [BioExcel](https://www.slideshare.net/BioExcel/bioexcel-webinar-series-introduction-to-the-common-workflow-language-cwl-project)
- [andrewjesaitis](https://andrewjesaitis.com/2017/02/common-workflow-language---a-tutorial-on-making-bioinformatics-repeatable/)
