var fs = require("fs");

var cwl = JSON.parse(fs.readFileSync("echo-pack.cwl"));
var version = {
  Version: "echoToStdout",
  Language: {
    Name: "cwl",
  },
  Definition: cwl,
};

var out_json = JSON.stringify(version, null, 4);

fs.writeFile("version.json", out_json, (err) => {
  if (err) {
    throw err;
  }
  console.log("JSON data is saved!");
});
