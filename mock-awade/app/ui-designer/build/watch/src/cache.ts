import * as fs from "fs";
import * as path from "path";
import {get as download} from "http";
import {tmpdir} from "os";
import {execSync as shell} from "child_process";
import {awadeRoot, compiledRoot, version} from "./shared";

export let initialized: boolean = false;

const compiledFileUrl = `http://rdk.zte.com.cn/vmax-studio/awade-download/app/ui-designer/build/watch/compiled-v${version}.zip`;
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
            // 强制异步调用
            setTimeout(() => {
                initialized = true;
                resolve();
            }, 100);
            return;
        }

        download(compiledFileUrl, res => downloadFile(res, resolve));
    });
}

export function updateCachedVersion() {
    if (fs.existsSync(compiledRoot)) {
        fs.writeFileSync(cachedVersion, version);
    }
}

function downloadFile(res, resolve): void {
    let data = "";
    res.setEncoding("binary");
    console.log('Downloading compiled file from:', compiledFileUrl);

    res.on("error", err => {
        console.error('Unable to download file, detail:', err);
        initialized = true;
        resolve();
    });

    res.on("data", chunk => data += chunk);
    res.on("end", () => deployFile(data, resolve));
}

function deployFile(data, resolve) {
    const zipFile = `${tmpdir()}/awade-watch-compiled-v${version}.zip`;
    fs.writeFileSync(zipFile, data, "binary");

    console.log("Cache files downloaded, deploying ....");

    const tmpCompiled = `${tmpdir()}/awade-compiled-tmp`;
    shell(`cmd /c ${toolsRoot}\\rm -fr ${tmpCompiled}`);
    try {
        shell(`cmd /c ${toolsRoot}\\unzip ${zipFile} -d ${tmpCompiled}`);
    } catch (e) {
        console.log("Unable to unzip the downloaded file!");
        initialized = true;
        resolve();
        return;
    }

    shell(`cmd /c ${toolsRoot}\\rm -fr ${zipFile}`);
    shell(`cmd /c ${toolsRoot}\\rm -fr ${compiledRoot}`);
    shell(`cmd /c ${toolsRoot}\\mv ${tmpCompiled}/compiled ${compiledRoot}`);
    shell(`cmd /c ${toolsRoot}\\rm -fr ${awadeRoot}/web/out/vmax-studio/awade`);
    shell(`cmd /c ${toolsRoot}\\mv ${tmpCompiled}/awade ${awadeRoot}/web/out/vmax-studio/`);

    updateCachedVersion();
    console.log("The files have been deployed!");
    initialized = true;
    resolve();
}
