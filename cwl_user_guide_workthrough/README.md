# CWL Notes

## CWL File

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

- `hints`: how to find Docker container
  - `DockerRequirement`: use `dockerPull: image:tag`
- `stdout`: for capturing a tool's stdout stream
  - Use `type: stdout` as an output param
- `arguments`: add extra arguments to `baseCommand`

* `records`: relationships between programs/params
* `requirements`: dependencies of program
* `steps`: linking programs together into workflows

### JS param references

See <https://www.commonwl.org/user_guide/06-params/index.html>

Use `$(...)` to refer to inputs dynamically, e.g.

- `$(inputs.foo)`
- For path to `File` objects use: `$(inputs.foofile.path)`

- `$(runtime.foo)`: runtime params provide info about hardware/software env when tool
  is executed.
  - `outdir`
  - `tmpdir`
  - `ram`
  - `cores`
  - `outdirSize`
  - `tmpdirSize`

## Input Params File

- `File`: requires `class` and `path`

## Tutorials

- [screx](https://github.com/screx/cwl-tutorial)
- [BioExcel](https://www.slideshare.net/BioExcel/bioexcel-webinar-series-introduction-to-the-common-workflow-language-cwl-project)
- [andrewjesaitis](https://andrewjesaitis.com/2017/02/common-workflow-language---a-tutorial-on-making-bioinformatics-repeatable/)
