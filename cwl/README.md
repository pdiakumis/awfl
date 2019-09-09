Common Workflow Language (CWL) Notes
====================================

File Structure
--------------
* `cwlVersion`: version of CWL used
* `class`: class of program (e.g. CommandLineTool, Workflow)
* `baseCommand`: name of program that will run
* `inputs`/`outputs`: inputs/outputs of program
* `records`: relationships between programs/parameters
* `requirements`: dependencies of program
* `steps`: linking programs together into workflows

Tool Wrapping
-------------

### echo

* Example usage

```
$ echo foo
foo
```

* CWL file

```
#!/usr/bin/env cwltool

cwlVersion: v1.0
class: CommandLineTool
baseCommand: echo

inputs:
  message:
    type: string
    inputBinding:
      position: 1
    label: message to print to stdout

outputs: []
```

* YAML file

```
message: Hello, World!
```

* Running:

```
cwltool echo.cwl echo_params.yml
```

### grep

* Example usage

```
$ grep "Hello, world" Hello_world.txt
Hello, world
```


* CWL file

```
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
```

* YAML file

```
extended: true
search_string: Hello, world
search_file:
  class: File
  path: "Hello_world.txt"
```

### wc

* Example usage

```
$ wc -l somefile.txt
5 somefile.txt
```


* CWL file

```
#!/usr/bin/env cwltool

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
```

* YAML file

```
input_file:
  class: File
  path: "somefile.txt"
```

### tar

* Example usage

```
tar -xvzf some.tar.xz
```

* CWL file

```
#!/usr/bin/env cwltool

cwlVersion: v1.0
class: CommandLineTool
baseCommand: tar
arguments: [-x, -v, -z, -f]
inputs:
  tarfile:
    type: File
    inputBinding:
      position: 1
    label: the file to be decompressed

outputs:
  extractfile:
    type: File
    outputBinding:
      glob: "*"
```

* YAML file

```
tarfile: some.tar.xz
```

Workflows
---------

