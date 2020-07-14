# awfl - Amazing Workflows <!-- omit in toc -->

Node.js application that helps to run bioinformatic workflows on the Illumina Analytics Platform.

- [General Steps](#general-steps)
  - [Step1: Workflow Parent](#step1-workflow-parent)
  - [Step2: Workflow Version](#step2-workflow-version)
  - [Step3: Workflow Launch](#step3-workflow-launch)
  - [Workflow Event History](#workflow-event-history)
  - [Abort Workflow Run](#abort-workflow-run)

## General Steps

All steps require the following environmental variables:

- `IAP_BASE_URL`: `https://aps2.platform.illumina.com`
- `IAP_ACCESS_TOKEN`: from `~/.session.yaml`

### Step1: Workflow Parent

- Input:
  - Workflow name
  - Workflow description
- Output:
  - workflowid (`wfl.xxx`)

```http
POST {{baseUrl}}/v1/workflows

{
    "name": "<WorkflowName>",
    "description": "<WorkflowDescription>"
}
```

### Step2: Workflow Version

- Input:
  - workflowid (`wfl.xxx`)
  - NameOfVersion
  - CWL packed (`cwltool --pack foo.cwl`)
- Output:
  - Not needed

```http
POST {{baseUrl}}/v1/workflows/{{workflowid}}/versions

{
    "Version": "<NameOfVersion>",
    "Language": {
        "Name": "cwl"
    },
    "Definition": {
        "<CWL packed>"
    }
}
```

### Step3: Workflow Launch

- Input:
  - workflowid (`wfl.xxx`)
  - NameOfVersion
  - NameOfLaunch
  - CWL inputs jsonised (`cwltool --make-template foo-pack.cwl | yq '.'`)
- Output:
  - workflowrunid (`wfr.xxx`)

```http
POST {{baseUrl}}/v1/workflows/{{workflowid}}/versions/{{NameOfVersion}}:launch

{
    "Name": "<NameOfLaunch>",
    "Input": {
        "<CWL inputs jsonised>"
    }
}
```

### Workflow Event History

Monitor workflow event history.

- Input:
  - workflowrunid (`wfr.xxx`)
- Output:
  - Information about workflow events

```http
GET {{baseUrl}}/v1/workflows/runs/{{workflowrunid}}/history
?pageSize=100
&sort=eventId
```

### Abort Workflow Run

Abort workflow run.

- Input:
  - workflowrunid (`wfr.xxx`)

```http
PUT {{baseUrl}}/v1/tasks/runs/{{workflowrunid}}:abort
```
