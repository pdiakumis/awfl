# Cromwell
The [five minute intro](http://cromwell.readthedocs.io/en/develop/tutorials/FiveMinuteIntro/) actually.. works.
Not much more to be said, just follow the install instructions and work through the intro section.

## Cromwell on Google
Using the Broad's [Cromwell on Google repo](https://github.com/broadinstitute/wdl/tree/develop/runners/cromwell_on_google)
to supplement the [introduction](http://cromwell.readthedocs.io/en/develop/tutorials/PipelinesApi101/). 
I've been following the [pipeline 101](http://cromwell.readthedocs.io/en/develop/tutorials/PipelinesApi101/) instructions 
to get up and running and that _seemed_ to work well. In general it is easier to use `gcloud` where the command is available. In brief:

* Install the Google SDK
* Create a Google Cloud Project (see below on how to set a default region for it; optional)
* Enable the relevant APIs (actual names are `Compute Engine API`, `Genomics API`, `Google Cloud Storage`)

Run through the `gcloud` authentication steps making sure to use the `application-default` approach (on top of the normal authentication); set the default project and set up a storage bucket (GCS) in the Australian region.

### Storage
Finally, create a Google Cloud Storage (GCS) bucket. Make sure to request a `regional` store (`australia-southeast1`) to ensure data lives close to compute. Can be done via the console or the `-l` option of `gsutil mb gs://my-bucket`.

### Dummy workflow
The `google.conf` config provided on the Cromwell 101 page works, except that the `compute-service-account = "default"` option for `JES` is in the wrong area -- see Jeff's comment on the [forum](https://groups.google.com/d/msg/google-genomics-discuss/_9C5fqkyO7Y/VQuA1agQAwAJ). It didn't make a difference for me but can't hurt to move into the right section when adding the project name and bucket ID to the config.
With that in place the `hello.wdl` example should work.

### Actual test workflow
After the basic 'hello world' workflows going with the basic [five dollar genome](https://github.com/gatk-workflows/five-dollar-genome-analysis-pipeline) example the Broad has generated. It pulls all data from the Broad's storage bucket and covers the basics (moving data, processing, storing results). It also includes examples on how to define inputs living on `gs`. Cloning the workflow to a local directory and keeping it alongside the `google.conf` and `*.jar` files for now to avoid path issues hardcoded into the workflow.

### Regions
Described in [default regions/zones](https://cloud.google.com/compute/docs/regions-zones/viewing-regions-zones):
`gcloud compute zones list`
Going with region `australia-southeast1` (and zone `australia-southeast1-a`) for now. Can follow up with Google to get a sense of differences or explore with `gcloud compute regions describe australia-southeast1`. Some information is also available in a [summary table](https://cloud.google.com/compute/docs/regions-zones/). 
Both zones and regions can be set to a [default](https://cloud.google.com/compute/docs/gcloud-compute/#set_default_zone_and_region_in_your_local_client) in the [console](https://console.cloud.google.com/compute/settings?project=umccr-cromwell-trial&folder&organizationId) but I am unsure  if Cromwell honors that information. Set zones/regions (via `gcloud` or ENV variables) _can_ be overridden by command line flags so this is not a guaranteed -- and based on the 'activity' logs in the console it seems instances keep spinning up in `us-central1-b`.
What _does_ work is passing an `--options` JSON to Cromwell, e.g., `java -Dconfig.file=google.conf -jar cromwell-31.jar run germline_single_sample_workflow.wdl  --inputs germline_single_sample_workflow.hg38.inputs.json --options google_options.json`
With `google_options.json`:
    {
      "read_from_cache":false,
      "default_runtime_attributes": {
        "zones": "australia-southeast1-a australia-southeast1-b australia-southeast1-c"
      }
    }

### Change quotas
Settings based on [Google Cloud Genomics recommendations](https://cloud.google.com/genomics/gatk). 
* `gcloud compute project-info describe --project umccr-cromwell-trial` to see current values
* Can be set on the [console](https://console.cloud.google.com/iam-admin/quotas). Note, quotas can _not_ be changed for free accounts.
* The [quota help page](https://cloud.google.com/compute/quotas) has relevant details on global vs regional quotas. This actually helps -- for now only changing _regional_ resources so we don't accidentally burn a lot of CPU time across regions (and pay for the data transfer). 
* Changed to 256 cores, 20,000 GB of persistent disk space, 100 In-Use IPs. Currently waiting for approval.

### ToDo
* Complete 5$ workflow
* Test with files on our bucket
* Go over [config options](http://cromwell.readthedocs.io/en/develop/Configuring/)
* Test [monitoring](https://github.com/openwdl/wdl/tree/master/runners/cromwell_on_google)
* Learn how to run with (persistent) MySQL backend on Google
* Tweak [runtime attributes](https://cromwell.readthedocs.io/en/develop/RuntimeAttributes/#default-values)

### Pointers

#### Running on GDC with a persistent MySQL backend
> The [jes-cromwell directory](https://github.com/broadinstitute/cromwell/blob/develop/scripts/docker-compose-mysql/jes-cromwell/jes-config/application.conf) is an example of how to customize the original compose file with a configuration file and environment variables. It uses the application default credentials of the host machine. To use it make sure your gcloud is up to date and that your application-default credentials are set up. 
> Then run `docker-compose -f docker-compose.yml -f jes-cromwell/docker-compose.yml` up to start a Cromwell server with a Google Cloud backend on MySQL.

### Questions
* Any benefit from adding (local) SSDs?
* How to make use of preemptible cores?
