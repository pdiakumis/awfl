Common Workflow Language (CWL) Notes
====================================

Tutorials
----------
* [screx](https://github.com/screx/cwl-tutorial)
* [BioExcel](https://www.slideshare.net/BioExcel/bioexcel-webinar-series-introduction-to-the-common-workflow-language-cwl-project)
* [andrewjesaitis](https://andrewjesaitis.com/2017/02/common-workflow-language---a-tutorial-on-making-bioinformatics-repeatable/)

File Structure
--------------
* `cwlVersion`: version of CWL used
* `class`: class of program (e.g. CommandLineTool, Workflow)
* `baseCommand`: name of program that will run
* `inputs`/`outputs`: inputs/outputs of program
* `records`: relationships between programs/parameters
* `requirements`: dependencies of program
* `steps`: linking programs together into workflows

