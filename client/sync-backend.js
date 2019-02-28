const path = require("path");
const fs = require("fs");
const copydir = require("copy-dir");

const buildDir = path.resolve(".", "build");
const serverPath = "server/apps/thysis/priv/web-client";
const deployDir = path.resolve("..", serverPath);

const deleteStatics = (toDelete = deployDir) => {
  // tslint:disable-next-line:no-console
  console.log("\n\nDeleting static files\n\n");

  fs.readdirSync(toDelete).forEach(file => {
    file = path.resolve(toDelete, file);
    if (fs.lstatSync(file).isFile()) {
      fs.unlinkSync(file);
    }
  });
};

const rewriteServiceWorkerFile = filePath => {
  const file = fs.readFileSync(filePath, "utf8");
  const match = /\[\[.+?\]\]/.exec(file)[0];
  const originalStatics = JSON.parse(match);
  const mediaFiles = [];
  const statics = originalStatics.map(static => {
    const [name, hash] = static;
    if (name === "/index.html") {
      return static;
    }

    const ext = path.extname(name);
    const val = [name.replace(ext, "") + "-" + hash + ext, hash];

    if (name.startsWith("/static/media")) {
      mediaFiles.push(val);
    }

    return val;
  });

  // we fake the hash of the font and favicon with new Date calls
  const staticsToString = JSON.stringify(
    originalStatics.concat([
      ...statics,
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

      [
        "https://fonts.gstatic.com/s/lato/v14/S6u_w4BMUTPHjxsI5wq_Gwftx9897g.woff2",
        new Date().getTime()
      ],

      ["/favicon.ico", "9608e38802208550e96f25bf8d7709b1"],

      [
        "/favicon-9608e38802208550e96f25bf8d7709b1.ico",
        "9608e38802208550e96f25bf8d7709b1"
      ],

      ["/manifest.json", "7bbf073902c795adf4c3fa5a1cb30c30"],

      [
        "/manifest-7bbf073902c795adf4c3fa5a1cb30c30.json",
        "7bbf073902c795adf4c3fa5a1cb30c30"
      ],

      ["/icon-192x192.png", "9df430944b7f0045c785d07dae84684f"],

      [
        "/icon-192x192-9df430944b7f0045c785d07dae84684f.png",
        "9df430944b7f0045c785d07dae84684f"
      ],

      ["/icon-512x512.png", new Date().getTime()],

      // append vsn=d query string to media file because that is how phoenix
      // will serve them
      ...mediaFiles.map(data => {
        const [name, hash] = data;
        return [`${name}?vsn=d`, hash];
      })
    ])
  );

  fs.writeFileSync(filePath, file.replace(match, staticsToString));
};

const make = () => {
  const args = process.argv;

  if (args.length === 2) {
    deleteStatics();
    // rewriteServiceWorkerFile(path.resolve(buildDir, "service-worker.js"));

    // tslint:disable-next-line:no-console
    console.log("\n\nCopying from: ", buildDir, " to: ", deployDir, "\n\n");

    copydir.sync(buildDir, deployDir);
  } else {
    deleteStatics(path.resolve(serverPath));
  }
};

make();
