const path = require("path");
const copydir = require("copy-dir");
const fs = require("fs");

const rmDir = function(dirPath) {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + "/" + files[i];
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        rmDir(filePath);
      }
    }
  }
  fs.rmdirSync(dirPath);
};

const buildDir = path.resolve(".", "build");
const deployDir = path.resolve("..", "server", "priv", "web-client");
rmDir(path.resolve(deployDir, "static"));
copydir.sync(buildDir, deployDir);
