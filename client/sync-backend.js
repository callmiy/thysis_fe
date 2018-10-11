const path = require("path");
const copydir = require("copy-dir");

const buildDir = path.resolve(".", "build");
const deployDir = path.resolve("..", "server", "priv", "web-client");

// tslint:disable-next-line:no-console
console.log("Copying from: ", buildDir, " to: ", deployDir);

copydir.sync(buildDir, deployDir);
