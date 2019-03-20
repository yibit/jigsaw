import {task} from 'gulp';
import {sequenceTask} from '../util/task_helpers';
import {composeRelease} from '../packaging/build-release';


task('basics:build-release', ['basics:prepare-release'], () => composeRelease('basics'));

task('basics:prepare-release', sequenceTask('basics:build'));
