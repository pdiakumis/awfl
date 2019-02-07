Workflow Description Language (WDL)
====================================

* [Website](https://software.broadinstitute.org/wdl/)
* [Quick Start](https://software.broadinstitute.org/wdl/documentation/quickstart)

Contents
---------

<!-- vim-markdown-toc GFM -->

* [Quick Example](#quick-example)
* [Basic components](#basic-components)
* [Plumbing](#plumbing)
* [Inputs](#inputs)
* [Execute](#execute)
* [Output](#output)
* [Extra Tools/Resources](#extra-toolsresources)
    * [womtool](#womtool)
        * [Usage](#usage)
    * [HumanCellAtlas/skylab](#humancellatlasskylab)
    * [BioWDL](#biowdl)
    * [miniwdl](#miniwdl)
* [Tutorials/Workshops](#tutorialsworkshops)
    * [Setup](#setup)
        * [Test data](#test-data)
        * [Conda Environment](#conda-environment)
        * [GATK](#gatk)
    * [Tut1 - First WDL script](#tut1---first-wdl-script)
        * [Validate WDL script](#validate-wdl-script)
        * [Generate JSON inputs](#generate-json-inputs)
        * [Run Cromwell](#run-cromwell)

<!-- vim-markdown-toc -->



Quick Example
-------------

```

workflow wf_1 {

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

Inputs
------

Specify inputs via JSON config, using `womtool`:

```
java -jar womtool.jar inputs wf.wdl > wf_inputs.json
```

Execute
-------

Run with Cromwell:

```
java -jar cromwell.jar run wf.wdl --inputs wf_inputs.json
```

Output
------

* Located in `cromwell-executions/<workflow>/<random-string>/<call>/execution`

Extra Tools/Resources
---------------------

### womtool

* Validates WDL files
* Generates JSON with inputs

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

Command: parse
(Deprecated; WDL draft 2 only) Print out the Hermes parser's abstract syntax tree for the source file.

Command: highlight
(Deprecated; WDL draft 2 only) Print out the Hermes parser's abstract syntax tree for the source file. Requires at least one of 'html' or 'console'

Command: graph
Generate and output a graph visualization of the workflow in .dot format

Command: upgrade
Automatically upgrade the WDL to version 1.0 and output the result.

Command: womgraph
(Advanced) Generate and output a graph visualization of Cromwell's internal Workflow Object Model structure for this workflow in .dot format

```

### HumanCellAtlas/skylab

Collection of WDL pipelines

- [GitHub](https://github.com/HumanCellAtlas/skylab)

### BioWDL

Collection of WDL pipelines

- [GitHub](https://github.com/biowdl)
- [WebSite](https://biowdl.github.io/)


### miniwdl

* [GitHub](https://github.com/chanzuckerberg/miniwdl)

WDL linter, among many other things

Tutorials/Workshops
-------------------

### Setup

#### Test data

* See <https://software.broadinstitute.org/wdl/documentation/article?id=7158>


#### Conda Environment

```
conda create --name cromwell -c conda-forge -c bioconda cromwell womtool
```

```
$ womtool --help
Error: Unable to access jarfile /Users/pdiakumis/my_apps/miniconda/envs/cromwell/share/womtool/womtool.jar
```

* You need to softlink to `womtool`:

```
cd /path/to/miniconda/envs/cromwell/share
ln -s womtool-36-0 womtool
```

#### GATK

* Download zip from their website, unzip, and link to 
  `gatk-4.1.0.0/gatk-package-4.1.0.0-local.jar`


### Tut1 - First WDL script

#### Validate WDL script

* Command:

```
womtool \
    validate \
    tut/01/haplotypecaller.wdl
```

* Output

```
<None>
```

* If nothing is output, it means it's probably ok
* Good for catching typos
* Also check out 

#### Generate JSON inputs

* Command:

```
womtool \
    inputs \
    tut/01/haplotypecaller.wdl > tut/01/hc_inputs.json
```

* Output:

```
$ cat tut/01/hc_inputs.json
{
  "helloHaplotypeCaller.haplotypeCaller.RefFasta": "File",
  "helloHaplotypeCaller.haplotypeCaller.bamIndex": "File",
  "helloHaplotypeCaller.haplotypeCaller.GATK": "File",
  "helloHaplotypeCaller.haplotypeCaller.RefIndex": "File",
  "helloHaplotypeCaller.haplotypeCaller.RefDict": "File",
  "helloHaplotypeCaller.haplotypeCaller.inputBAM": "File",
  "helloHaplotypeCaller.haplotypeCaller.sampleName": "String"
}
```

#### Run Cromwell

```
cromwell \
    run \
    tut/01/haplotypecaller.wdl \
    -i tut/01/hc_inputs.json
```

* Output:

```

cromwell-executions/
└── helloHaplotypeCaller
    └── 6cc43e6a-1c4a-455a-8142-b01922b1c2f0
        └── call-haplotypeCaller
            ├── execution
            │   ├── NA12878.raw.indels.snps.vcf
            │   ├── NA12878.raw.indels.snps.vcf.idx
            │   ├── rc
            │   ├── script
            │   ├── script.background
            │   ├── script.submit
            │   ├── stderr
            │   ├── stderr.background
            │   ├── stdout
            │   └── stdout.background
            ├── inputs
            │   ├── -1485200933
            │   │   ├── human_g1k_b37_20.dict
            │   │   ├── human_g1k_b37_20.fasta
            │   │   └── human_g1k_b37_20.fasta.fai
            │   ├── 1953056760
            │   │   └── gatk-package-4.1.0.0-local.jar -> /home/pdiakumis/my_apps/gatk-4.1.0.0/gatk-package-4.1.0.0-local.jar
            │   └── 883151777
            │       ├── NA12878_wgs_20.bai
            │       └── NA12878_wgs_20.bam
            └── tmp.f051c2d8

9 directories, 16 files
```

