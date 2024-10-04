const fs = require("fs");
const path = require("path");

const version = process.env.npm_package_version;
const versionInfo = { version };

fs.writeFileSync(
  path.join(__dirname, "src/assets/version.json"),
  JSON.stringify(versionInfo, null, 2)
);
console.log("version.json created with version:", version);
