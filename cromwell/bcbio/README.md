Cromwell via bcbio
==================

<!-- vim-markdown-toc GFM -->

* [Step 1: Prepare bcbio input](#step-1-prepare-bcbio-input)
    * [Input](#input)
    * [Command](#command)
    * [Output](#output)
* [Step 2: Generate CWL files](#step-2-generate-cwl-files)
    * [Input](#input-1)
    * [Command](#command-1)
    * [Output](#output-1)
* [Step 3: Run Cromwell via bcbio](#step-3-run-cromwell-via-bcbio)
    * [Input](#input-2)
    * [Command](#command-2)
    * [Output](#output-2)
* [bcbio Cromwell Code](#bcbio-cromwell-code)

<!-- vim-markdown-toc -->
## Step 1: Prepare bcbio input

### Input

* bcbio workflow template
* bcbio sample metadata file
* path to FASTQ data

```
|-- 2018-07-31T0309_Avner_test_WGS-merged.csv
|-- data -> ../test1/data
|   |-- CCR180097_EH18B002P009_R1.fastq.gz -> /g/data3/gx8/projects/Grimmond_Avner/data/merged/CCR180097_EH18B002P009_R1.fastq.gz
|   |-- CCR180097_EH18B002P009_R2.fastq.gz -> /g/data3/gx8/projects/Grimmond_Avner/data/merged/CCR180097_EH18B002P009_R2.fastq.gz
|   |-- CCR180098_EH18T002P009_R1.fastq.gz -> /g/data3/gx8/projects/Grimmond_Avner/data/merged/CCR180098_EH18T002P009_R1.fastq.gz
|   `-- CCR180098_EH18T002P009_R2.fastq.gz -> /g/data3/gx8/projects/Grimmond_Avner/data/merged/CCR180098_EH18T002P009_R2.fastq.gz
`-- std_workflow_cancer.yaml
```

### Command 

```
bcbio_nextgen.py \
  -w template std_workflow_cancer.yaml \
  2018-07-31T0309_Avner_test_WGS-merged.csv \
  data/*fastq.gz
```

### Output

* Generates the standard bcbio yaml config

```
2018-07-31T0309_Avner_test_WGS-merged
|-- config
|   |-- 2018-07-31T0309_Avner_test_WGS-merged-template.yaml
|   |-- 2018-07-31T0309_Avner_test_WGS-merged.csv
|   `-- 2018-07-31T0309_Avner_test_WGS-merged.yaml
`-- work
```

## Step 2: Generate CWL files

### Input

* above generated `-merged.yaml` config
* system config (for now)

### Command

* note the `cwl` option

```
bcbio_vm.py cwl \
  --systemconfig /g/data/gx8/local/development/bcbio/galaxy/bcbio_system.yaml \
  2018-07-31T0309_Avner_test_WGS-merged/config/2018-07-31T0309_Avner_test_WGS-merged.yaml
```

### Output

```
2018-07-31T0309_Avner_test_WGS-merged-workflow
|-- main-2018-07-31T0309_Avner_test_WGS-merged-samples.json
|-- main-2018-07-31T0309_Avner_test_WGS-merged.cwl
|-- steps
|   |-- alignment_to_rec.cwl
|   |-- batch_for_ensemble.cwl
|   |-- batch_for_sv.cwl
|   |-- batch_for_variantcall.cwl
|   |-- calculate_sv_bins.cwl
|   |-- calculate_sv_coverage.cwl
|   |-- combine_calls.cwl
|   |-- combine_sample_regions.cwl
|   |-- compare_to_rm.cwl
|   |-- concat_batch_variantcalls.cwl
|   |-- detect_sv.cwl
|   |-- get_parallel_regions.cwl
|   |-- merge_split_alignments.cwl
|   |-- multiqc_summary.cwl
|   |-- normalize_sv_coverage.cwl
|   |-- pipeline_summary.cwl
|   |-- postprocess_alignment.cwl
|   |-- postprocess_alignment_to_rec.cwl
|   |-- postprocess_variants.cwl
|   |-- prep_align_inputs.cwl
|   |-- prep_samples.cwl
|   |-- prep_samples_to_rec.cwl
|   |-- process_alignment.cwl
|   |-- qc_to_rec.cwl
|   |-- summarize_sv.cwl
|   |-- summarize_vc.cwl
|   `-- variantcall_batch_region.cwl
|-- wf-alignment.cwl
|-- wf-svcall.cwl
`-- wf-variantcall.cwl

1 directory, 32 files
```

## Step 3: Run Cromwell via bcbio

### Input

* above generated CWL directory

### Command

```
#!/bin/bash
#PBS -P gx8
#PBS -q normalsp
#PBS -l walltime=96:00:00
#PBS -l mem=8GB
#PBS -l ncpus=1
#PBS -l software=bcbio
#PBS -l wd
bcbio_vm.py cwlrun cromwell \
  ./2018-07-31T0309_Avner_WGS-merged-workflow \
  --no-container \
  -q normal \
  -s pbspro \
  -r 'walltime=48:00:00;noselect;jobfs=100GB'
```

### Output

TBD


## bcbio Cromwell Code

* `https://github.com/bcbio/bcbio-nextgen-vm/scripts/bcbio_vm.py`


```
bcbio_vm.py cwlrun \ 
  cromwell \ --> tool = cromwell
 ./path-to-merged-workflow \ --> directory = path-to-merged-workflow
 --no-container \ --> no_container = True
 -q normal \ --> queue = x
 -s pbspro \ --> scheduler = pbspro
 -r x \ --> resources = x
```

* Feed the arguments to `run` in `bcbio-nextgen/bcbio/cwl/tool.py`
* It calls `_run_cromwell` with the provided args


* First uses `_get_main_and_json(args.directory)`, which retrieves main CWL and sample JSON files
  from the `path-to-merged-workflow` directory e.g.: 
    - `/abs/path-to-merged-workflow/main-projX-merged.cwl` 
    - `/abs/path-to-merged-workflow/main-projX-samples.json`
    - `projX`
* Create: 
  - `cromwell_work`
  - `cromwell_work/final`
  - `cromwell_work/projX-cromwell.log`
  - `cromwell_work/projX-metadata.json`
  - `cromwell_work/projX-options.json`
    - Write: 
      - `"final_workflow_outputs_dir"`: `cromwell_work/final`
      - `"default_runtime_attributes"`: `{"bootDiskSizeGb": 20}`

* Command:

```
cromwell -Xms1g -Xmx3g run \
  -Dconfig.file=`file-from-hpc.create_cromwell_config(args, work_dir, json_file)` \
  + `hpc.args_to_cromwell_cl(args)` \
  + --metadata-output cromwell_work/projX-metadata.json \
  + --options cromwell_work/projX-options.json \
  + --inputs path-to-merged-workflow/main-projX-samples.json \
  + path-to-merged-workflow/main-projX-merged.cwl # workflow file
```

* `hpc.create_cromwell_config`


```
```

* `hpc.args_to_cromwell_cl`

```
```

* Then:
  - change to `cromwell_work`
  - `_run_tool(cromwell-cmd-from-above, false, work_dir, log_file)

* `_run_tool(cromwell-cmd-from-above, false, work_dir, log_file)
  - runs the Cromwell command via `subprocess.check_call`, and does
    some other little things


* After the command has ended, do:
  - check if metadata["status"] is "Failed"
    - if it's failed, try debugging
    - if it's ok, run `_cromwell_move_outputs(metadata, final_dir)`

* `_cromwell_move_outputs(metadata, final_dir)`
  - `cromwell_work/final/project` will contain the project-level final data
  - `tumor-sample`, `normal-sample` will contain the per-sample data

