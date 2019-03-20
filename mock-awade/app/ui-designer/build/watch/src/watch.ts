import * as fs from "fs";
import * as chokidar from "chokidar";
import {awadeRoot, changes, compiledRoot, normalizePath, saveImports, toCompiledPath} from "./shared";
import {compile, scriptFileNames, scriptVersions} from "./compile";
import {ChangeEvent} from "./typings";
import {createServerBundle, createWebBundle} from "./bundle";


const watchingDirs = [
    `${awadeRoot}/basics/src`, `${awadeRoot}/compiler/module/src`,
    `${awadeRoot}/services/src`, `${awadeRoot}/web/src`, `${awadeRoot}/sdk/src`
];
const watcher = chokidar.watch(watchingDirs, {
    ignored: /(.*\.(.*___jb_\w+___|d\.ts|spec\.ts|gitkeep)$)|(awade[cu]\.js)|(package(-lock)?\.json)/,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    },
});
watcher
    .on('add', path => cacheChange(path, 'add'))
    .on('change', path => cacheChange(path, 'change'))
    .on('unlink', path => cacheChange(path, 'unlink'));

let timerHandler = null;

function cacheChange(path: string, event: 'add' | 'change' | 'unlink'): void {
    let sign;
    if (event == 'unlink') {
        sign = '-';
    } else if (event == 'change') {
        sign = '*';
    } else {
        sign = '+';
    }
    console.log(`${sign} ): ${path}`);
    const idx = changes.findIndex(ch => ch.path == path && ch.event == event);
    if (idx != -1) {
        changes.splice(idx, 1);
    }
    path = normalizePath(path);
    changes.push({path, event});

    clearTimeout(timerHandler);
    timerHandler = setTimeout(() => {
        timerHandler = null;
        handleChanges();
    }, 300);
}

function handleChanges(): void {
    const processed = [];
    while (changes.length > 0) {
        const change = changes.shift();
        if (!change) {
            break;
        }

        updateTypescriptFiles(change.path, change.event);
        console.log('Processing file', change.path);
        compile(change.path);
        const compiledPath = toCompiledPath(change.path);
        if (processed.indexOf(compiledPath) == -1) {
            processed.push(compiledPath);
        }
    }
    saveImports();

    createServerBundle(processed,
        `${compiledRoot}/services/src/exports.js`,
        `${awadeRoot}/server/dist/awade-services.js`);
    createServerBundle(processed,
        `${compiledRoot}/compiler/module/src/bin/awadec.js`,
        `${awadeRoot}/compiler/module/src/bin/awadec.js`);
    createServerBundle(processed,
        `${compiledRoot}/compiler/module/src/bin/awadeu.js`,
        `${awadeRoot}/compiler/module/src/bin/awadeu.js`);

    createWebBundle(processed, '@awade/basics',
        `${compiledRoot}/basics/src/public_api.js`,
        `${awadeRoot}/web/out/vmax-studio/awade/basics.bundle.js`);
    createWebBundle(processed, 'main',
        `${compiledRoot}/web/src/main.js`,
        `${awadeRoot}/web/out/vmax-studio/awade/main.bundle.js`);
}

function updateTypescriptFiles(sourcePath: string, event: ChangeEvent): void {
    if (!sourcePath.match(/.+\.ts/i)) {
        return;
    }

    const idx = scriptFileNames.indexOf(sourcePath);
    if (event == 'unlink' && idx != -1) {
        scriptFileNames.splice(idx, 1);
        const compiledPath = toCompiledPath(sourcePath);
        if (fs.existsSync(compiledPath)) {
            fs.unlinkSync(compiledPath);
        }
    }
    if (event != 'unlink' && idx == -1) {
        scriptFileNames.push(sourcePath);
    }
    if (!scriptVersions.has(sourcePath)) {
        scriptVersions.set(sourcePath, 0);
    }
    const ver = scriptVersions.get(sourcePath);
    scriptVersions.set(sourcePath, ver == undefined || ver == null ? 0 : ver + 1);
}
