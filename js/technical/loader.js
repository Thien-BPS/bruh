// Load files

function mergeIntoGlobal(object) {
    for (const key in object) {
      if (key === "default") {
        // Skip default exports
        continue;
      }
      const value = object[key];
      const existingValue = window[key];
      if (existingValue !== undefined) {
        throw `Property ${key} already exists in global context`;
      }
  
      window[key] = value;
    }
  }

for (file in modInfo.modFiles) {
    let script = document.createElement("script");
    script.setAttribute("type", "module");
    script.setAttribute("src", "js/" + modInfo.modFiles[file]);
    script.setAttribute("async", "false");
    document.head.insertBefore(script, document.getElementById("temp"));
}

import * as GlobalContents from "./globals.js"
mergeIntoGlobal(GlobalContents);
