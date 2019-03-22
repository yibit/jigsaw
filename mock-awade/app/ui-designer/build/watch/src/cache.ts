import * as fs from "fs";
import * as path from "path";
import {get as download} from "http";
import {tmpdir} from "os";
import {execSync as shell} from "child_process";
import {awadeRoot, compiledRoot, version} from "./shared";

const compiledFileUrl = `http://localhost:9090/vmax-studio/download/app/ui-designer/build/watch/compiled-v${version}.zip`;
const cachedVersion = `${compiledRoot}/version.txt`;
const toolsRoot = path.resolve(`${awadeRoot}/../../tools/mock-shell/usr/bin`);

export function downloadCompiledFiles(): Promise<void> {
    return new Promise<void>(resolve => {
        if (process.platform.indexOf('win') == -1) {
            // on linux, don't download any file
            resolve();
            return;
        }
        if (fs.existsSync(cachedVersion) && fs.readFileSync(cachedVersion).toString() == version) {
            console.log('The compiled files are ready!');
            resolve();
            return;
        }

        download(compiledFileUrl, res => downloadFile(res, resolve));
    });
}

export function updateCachedVersion() {
    fs.writeFileSync(cachedVersion, version);
}

function downloadFile(res, resolve): void {
    let data = "";
    res.setEncoding("binary");
    console.log('Downloading compiled file from:', compiledFileUrl);

    res.on("error", err => {
        console.error('Unable to download file, detail:', err);
        resolve();
    });

    res.on("data", chunk => data += chunk);
    res.on("end", () => deployFile(data, resolve));
}

function deployFile(data, resolve) {
    const zipFile = `${tmpdir()}/awade-watch-compiled-v${version}.zip`;
    fs.writeFileSync(zipFile, data, "binary");

    console.log("File downloaded, deploying ....");
    try {
        shell(`cmd /c ${toolsRoot}\\rm -fr ${compiledRoot}`);
        shell(`cmd /c ${toolsRoot}\\unzip ${zipFile} -d ${compiledRoot}`);
        updateCachedVersion();
        console.log("The files have been deployed!");
    } catch (e) {
        console.log("Unable to unzip the downloaded file!");
    }

    resolve();
}
