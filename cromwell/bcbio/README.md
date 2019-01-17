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
