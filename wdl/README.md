Workflow Description Language (WDL)
====================================


<!-- vim-markdown-toc GFM -->

* [Quick Example](#quick-example)
* [Basic components](#basic-components)
* [Plumbing](#plumbing)
* [Extras](#extras)
    * [womtool](#womtool)
        * [Usage](#usage)

<!-- vim-markdown-toc -->

* [Website](https://software.broadinstitute.org/wdl/)
* [Quick Start](https://software.broadinstitute.org/wdl/documentation/quickstart)


Quick Example
-------------

```

workflow wf1 {

  File my_ref
  File my_input
  String name

  call task_A {
    input: ref = my_ref, in = my_input, id = name
  }

  call task_B {
    input: ref = my_ref, in = task_A.out
  }

}

task task_A {
  File ref
  File in
  String id

  command {
    do_stuff R=${ref} I=${in} O=${id}.ext
  }

  output {
    File out="${id}.ext"
  }
}

task task_B {
  command { ... }
  output { ... }
}
```


Basic components
----------------

1. `workflow`: 
  - main workflow in WDL script
  - make `calls` to multiple `tasks`
  - variables available to all `tasks`


2. `task`:
  - in WDL script, but outside `workflow`
  - contains:
    - `command` to be run
    - `output` from the `command`
  - variables can be specified per-task


3. `call`: 
  - specify which task to call, and with which input variables

4. `command`:
  - can be any command you'd run in the terminal

5. `output`:
  - which part of the `command` constitutes its output


Plumbing
--------

* Linear chaining
  - Feed the output of one task to the input of the next

* Multi-input/Multi-output
  - Feed multiple outputs of one task into multiple inputs of the next

* Scatter-Gather
  - `scatter`: 
    - produce parallelisable jobs running same task on each input in an array
    - output results as an array
  - `gather`:
    - implicitly take the output from a `scatter` function

* Task Aliasing
  - use `call stepA as foo` and `call stepA as bar` if you want to run a task more than once in a workflow

Extras
------

### womtool

- [GitHub](https://github.com/broadinstitute/cromwell/tree/develop/womtool)
- [Docs](https://cromwell.readthedocs.io/en/develop/WOMtool/)

#### Usage

```
java -jar womtool-36.jar --help
womtool cromwell-version.conf-to-be-generated-by-sbt
Usage: java -jar womtool.jar [validate|inputs|parse|highlight|graph|upgrade|womgraph] [options] workflow-source

  workflow-source          Path to workflow file.
  -i, --inputs <value>     Workflow inputs file.
  -h, --highlight-mode <value>
                           Highlighting mode, one of 'html', 'console' (used only with 'highlight' command)
  -o, --optional-inputs <value>
                           If set, optional inputs are also included in the inputs set. Default is 'true' (used only with the inputs command)
  --help
  --version

Command: validate
Validate a workflow source file. If inputs are provided then 'validate' also checks that the inputs file is a valid set of inputs for the workflow.

Command: inputs
Generate and output a new inputs JSON for this workflow.

Command: graph
Generate and output a graph visualization of the workflow in .dot format

Command: upgrade
Automatically upgrade the WDL to version 1.0 and output the result.

Command: womgraph
Generate and output a graph visualization of Cromwell's internal Workflow Object Model structure for this workflow in .dot format
```

