# awfl - Amazing Workflows <!-- omit in toc -->

Node.js application that helps to run bioinformatic workflows on the Illumina Analytics Platform.

- [General Steps](#general-steps)
  - [Step1: Workflow Parent](#step1-workflow-parent)
  - [Step2: Workflow Version](#step2-workflow-version)
  - [Step3: Workflow Launch](#step3-workflow-launch)
  - [Workflow Event History](#workflow-event-history)
  - [Abort Workflow Run](#abort-workflow-run)
- [CLI](#cli)
  - [Output1: JSON packed CWL](#output1-json-packed-cwl)
  - [Output2: JSON for version](#output2-json-for-version)
  - [Output3: JSON for launch](#output3-json-for-launch)
- [Structure](#structure)

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
```

```json
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
```

```json
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
  - CWL inputs jsonised (`cwltool --make-template foo-pack.cwl`)
- Output:
  - workflowrunid (`wfr.xxx`)

```http
POST {{baseUrl}}/v1/workflows/{{workflowid}}/versions/{{NameOfVersion}}:launch
```

```json
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

## CLI

Step 2 (Version) and Step 3 (Launch) can be automated a bit more, by
generating the required JSON bodies.

`awfl -c <PathToCwlYaml> -v <NameOfVersion> -l <NameOfLaunch>`

Option description:

- `-c <PathToCwlYaml>`: path to original CWL file
- `-v <NameOfVersion>`: name given to workflow version (default: 'version1')
- `-l <NameOfLaunch>`: name given to launched workflow (default: 'launch1')

Algorithm:

- Validate CWL file using `cwltool --validate <PathToCwlYaml>`
  - if it fails validation, exit with error message
  - if it passes validation, continue
- Run `cwltool --pack <PathToCwlYaml>`
  - output to `<PathToCwlYaml>-packed.json`
  - create 'version' JSON, that has a 'Version'
    and the packed CWL as its 'Definition'
  - Output JSON named as `<NameOfVersion>.json`
- Run `cwltool --make-template <PathToCwlYaml>-packed.json`
  - read in the generated YAML inputs with `js-yaml`
  - create 'launch' JSON, that has a 'Name'
    and the CWL inputs as JSON

### Output1: JSON packed CWL

```json
// <cwl_file>-packed.json
{
  "class": "CommandLineTool",
  "label": "foo",
  "doc": "foo",
  "requirements": [],
  "baseCommand": ["echo"],
  "arguments": [],
  "inputs": [{}, {}],
  "outputs": [{}, {}],
  "id": "#main",
  "cwlVersion": "v1.1"
}
```

### Output2: JSON for version

```json
// <NameOfVersion>.json
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

### Output3: JSON for launch

```json
// <NameOfLaunch>.json
{
    "Name": "<NameOfLaunch>",
    "Input": {
        "<CWL inputs jsonised>"
    }
}
```

## Structure

```text
tools/
  |---tool1/
     |---tool1.http
     |---version1/
       |---tool1.cwl
       |---tool1-packed.json
       |---version.json
       |---launchA.json
       |---launchB.json
     |---version2/
       |---tool1.cwl
       |---tool1-packed.json
       |---version.json
       |---launchA.json
       |---launchB.json
```
