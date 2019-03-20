import {task} from 'gulp';
import {readFileSync} from 'fs';
import {join} from 'path';
import {green, red} from 'chalk';
import {sequenceTask} from '../util/task_helpers';
import {buildConfig} from '../packaging/build-config';

/** Path to the directory where all releases are created. */
const releasesDir = join(buildConfig.outputDir, 'releases');

/** RegExp that matches Angular component inline styles that contain a sourcemap reference. */
const inlineStylesSourcemapRegex = /styles: ?\[["'].*sourceMappingURL=.*["']/;

/** RegExp that matches Angular component metadata properties that refer to external resources. */
const externalReferencesRegex = /(templateUrl|styleUrls): *["'[]/;

task('validate-release', sequenceTask(':publish:build-releases', 'validate-release:check-bundles'));

/** Task that checks the release bundles for any common mistakes before releasing to the public. */
task('validate-release:check-bundles', () => {
    const failure = checkReleasePackage('basics');
    if (failure && failure.length > 0) {
        console.error(red(`Failure: ${failure}`));
        // Throw an error to notify Gulp about the failures that have been detected.
        throw 'Release output is not valid and not ready for being released.';
    } else {
        console.log(green('Release output has been checked and everything looks fine.'));
    }
});

/** Task that validates the given release package before releasing. */
function checkReleasePackage(packageName: string): string[] {
    const bundlePath = join(releasesDir, packageName, 'bundles', `basics.js`);
    const bundleContent = readFileSync(bundlePath, 'utf8');
    let failures = [];

    if (inlineStylesSourcemapRegex.exec(bundleContent) !== null) {
        failures.push('Bundles contain sourcemap references in component styles.');
    }

    if (externalReferencesRegex.exec(bundleContent) !== null) {
        failures.push('Bundles are including references to external resources (templates or styles)');
    }

    return failures;
}

