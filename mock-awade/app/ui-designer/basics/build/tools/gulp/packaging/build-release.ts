import {join} from 'path';
import {copyFiles} from '../util/copy-files';
import {addPureAnnotationsToFile} from './pure-annotations';
import {updatePackageVersion} from './package-versions';
import {inlinePackageMetadataFiles} from './metadata-inlining';
import {createTypingsReexportFile} from './typings-reexport';
import {createMetadataReexportFile} from './metadata-reexport';
import {buildConfig} from './build-config';

const {outputDir, projectDir} = buildConfig;

/** Directory where all bundles will be created in. */
const bundlesDir = join(outputDir, 'bundles');

/**
 * Copies different output files into a folder structure that follows the `angular/angular`
 * release folder structure. The output will also contain a README and the according package.json
 * file. Additionally the package will be Closure Compiler and AOT compatible.
 */
export function composeRelease(packageName: string) {
    const packagePath = join(outputDir, 'packages', 'src');
    const releasePath = join(outputDir, 'releases', packageName);

    inlinePackageMetadataFiles(packagePath);

    copyFiles(packagePath, '**/*.+(d.ts|metadata.json)', join(releasePath, 'typings'));
    copyFiles(bundlesDir, `basics.umd?(.min).js?(.map)`, join(releasePath, 'bundles'));
    copyFiles(bundlesDir, `basics?(.es5).js?(.map)`, join(releasePath, 'bundles'));
    copyFiles(projectDir, 'LICENSE', releasePath);
    copyFiles(projectDir, 'README.md', releasePath);
    copyFiles(projectDir, 'package.json', releasePath);

    updatePackageVersion(releasePath);
    createTypingsReexportFile(releasePath, 'basics');
    createMetadataReexportFile(releasePath, 'basics');
    addPureAnnotationsToFile(join(releasePath, 'bundles', `basics.es5.js`));
}
