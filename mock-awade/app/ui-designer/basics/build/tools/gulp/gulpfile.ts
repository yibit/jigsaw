import {createPackageBuildTasks} from './packaging/build-tasks-gulp';

// Create gulp tasks to build the different packages in the project.
createPackageBuildTasks('basics');

import './tasks/clean';
import './tasks/default';
import './tasks/publish';
import './tasks/release';
import './tasks/validate-release';

