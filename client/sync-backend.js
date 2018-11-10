const path = require("path");
const fs = require("fs");
const copydir = require("copy-dir");

const buildDir = path.resolve(".", "build");
const deployDir = path.resolve("..", "server", "priv", "web-client");

fs.readdirSync(deployDir).forEach(file => {
  file = path.resolve(deployDir, file);
  if (fs.lstatSync(file).isFile()) {
    fs.unlinkSync(file);
  }
});

const rewriteServiceWorkerFile = filePath => {
  const file = fs.readFileSync(filePath, "utf8");
  const match = /\[\[.+?\]\]/.exec(file)[0];
  const statics = JSON.parse(match).map(static => {
    const [name, hash] = static;
    if (name === "/index.html") {
      return static;
    }

    const ext = path.extname(name);

    return [name.replace(ext, "") + "-" + hash + ext, hash];
  });

  // we fake the hash of the font and favicon with new Date calls
  const staticsToString = JSON.stringify(
    statics.concat([
      [
        "https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin",
        new Date().getTime()
      ],

      [
        "https://fonts.gstatic.com/s/lato/v14/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2",
        new Date().getTime()
      ],

      [
        "https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wXiWtFCc.woff2",
        new Date().getTime()
      ],

      ["/favicon.ico", "9608e38802208550e96f25bf8d7709b1"],

      [
        "/favicon-9608e38802208550e96f25bf8d7709b1.ico",
        "9608e38802208550e96f25bf8d7709b1"
      ],

      [
        "/manifest-7bbf073902c795adf4c3fa5a1cb30c30.json",
        "7bbf073902c795adf4c3fa5a1cb30c30"
      ],

      [
        "/icon-192x192-9df430944b7f0045c785d07dae84684f.png",
        "9df430944b7f0045c785d07dae84684f"
      ],

      ["/icon-512x512.png", new Date().getTime()]
    ])
  );
  fs.writeFileSync(filePath, file.replace(match, staticsToString));
};

rewriteServiceWorkerFile(path.resolve(buildDir, "service-worker.js"));

// tslint:disable-next-line:no-console
console.log("Copying from: ", buildDir, " to: ", deployDir);

copydir.sync(buildDir, deployDir);
