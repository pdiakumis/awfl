#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const cli = require("../src/cli").argv;
const files = require("../src/files");

files.cwltool_validate(cli.cwl);
