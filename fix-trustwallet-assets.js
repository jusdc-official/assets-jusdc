const fs = require("fs");
const path = require("path");

const assetsPath = "./blockchains"; // Change if your repo structure differs

function toLowerCaseFolder(folderPath) {
    const parent = path.dirname(folderPath);
    const lowerName = path.basename(folderPath).toLowerCase();
    const newPath = path.join(parent, lowerName);
    if (folderPath !== newPath) {
        fs.renameSync(folderPath, newPath);
        console.log(`Renamed folder: ${folderPath} → ${newPath}`);
    }
    return newPath;
}

function fixInfoJson(infoPath) {
    const rawData = fs.readFileSync(infoPath, "utf8");
    let data;
    try {
        data = JSON.parse(rawData);
    } catch (e) {
        console.error(`Invalid JSON: ${infoPath}`);
        return;
    }

    if (data.id) {
        data.id = data.id.toLowerCase();
    }

    if (data.explorer) {
        const parts = data.explorer.split("/");
        const last = parts.pop().toLowerCase();
        parts.push(last);
        data.explorer = parts.join("/");
    }

    fs.writeFileSync(infoPath, JSON.stringify(data, null, 4));
    console.log(`Fixed info.json: ${infoPath}`);
}

function walkAssets(dir) {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.lstatSync(fullPath).isDirectory()) {
            if (item.match(/^0x[a-fA-F0-9]{40}$/)) {
                const fixedPath = toLowerCaseFolder(fullPath);
                const infoFile = path.join(fixedPath, "info.json");
                const logoFile = path.join(fixedPath, "logo.png");

                if (fs.existsSync(infoFile)) {
                    fixInfoJson(infoFile);
                } else {
                    console.warn(`⚠ Missing info.json: ${infoFile}`);
                }

                if (!fs.existsSync(logoFile)) {
                    console.warn(`⚠ Missing logo.png: ${logoFile}`);
                }
            } else {
                walkAssets(fullPath);
            }
        }
    });
}

walkAssets(assetsPath);
console.log("✅ Finished processing Trust Wallet assets repo");
