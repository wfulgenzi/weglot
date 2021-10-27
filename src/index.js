const fs = require("fs");
const { INPUTS_DIR } = require("./vars");
const { processInput } = require("./finder");

fs.readdir(INPUTS_DIR, (err, files) => {
  if(err) {
    console.error("Error:   Local input files not found.")
    process.exit(65)
  }
  files.forEach(file => {
    processInput(file);
  });
});
