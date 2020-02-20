const fs = require("fs");
const version = parseInt(fs.readFileSync("VERSION").toString("utf-8"));
console.log(`Update version to ${version + 1}`);
fs.writeFileSync("VERSION", (version + 1).toString());
console.log(`Write version successful`);
