import * as fs from "fs";
import * as path from "path";
import * as sh from "shelljs";
import {get as download} from "http";
import {tmpdir} from "os";
import {awadeRoot, compiledRoot, getPath, version} from "./shared";
import {ImportFile} from "./typings";

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
            }, 350 /* timeout 必须大于300*/);
            return;
        }

        download(compiledFileUrl, res => downloadFile(res, resolve));
    });
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
    sh.rm('-rf', tmpCompiled);
    const result = sh.exec(`cmd /c ${toolsRoot}\\unzip ${zipFile} -d ${tmpCompiled}`);
    if (result.code != 0) {
        console.log("Unable to unzip the downloaded file!");
        initialized = true;
        resolve();
        return;
    }
    sh.rm('-fr', zipFile);
    sh.rm('-fr', compiledRoot);
    const len = `${tmpCompiled}/compiled`.length;
    const re = /"(!!node-loader!)?.+?\/build\/watch\/compiled\/(.+?)"/g;
    sh.find(`${tmpCompiled}/compiled`).forEach(file => {
        // 因为从服务器下载得到的文件里带的绝对路径是服务器上的，这里需要修正为本地路径
        if (fs.statSync(file).isDirectory()) {
            return;
        }
        let content = fs.readFileSync(file).toString();
        if (file.match(/.+\.(js|import)$/i)) {
            content = content.replace(re, (found, nodeLoader, path) => {
                nodeLoader = nodeLoader ? nodeLoader : '';
                return `"${nodeLoader}${compiledRoot}/${path}"`;
            });
        }
        file = compiledRoot + file.substring(len);
        sh.mkdir('-p', getPath(file));
        fs.writeFileSync(file, content);
    });
    sh.rm('-fr', `${awadeRoot}/web/out/vmax-studio/awade`);
    sh.cp('-r', `${tmpCompiled}/awade`, `${awadeRoot}/web/out/vmax-studio/`);
    sh.rm('-fr', tmpCompiled);

    console.log("The files have been deployed!");
    initialized = true;
    resolve();
}
