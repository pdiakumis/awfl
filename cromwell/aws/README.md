Cromwell on AWS
===============

Contents
--------


Requirements
------------
* EC2 instance for Cromwell server
* EC2 ECS Optimised AMI with customisations for
    - Genomics workloads
    - Interfacing with Cromwell
* S3 bucket for input and output
* AWS Batch
    - Compute environment
    - Job queue

### AWS Batch
* Helps you run batch jobs on AWS Cloud (d'oh)
* Submit jobs to the queue, specifying app to run and CPU/mem reqs
* Responsible for launching the appropriate quantity 
  and types of EC2 instances needed to run the jobs
