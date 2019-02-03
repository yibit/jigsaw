#!/bin/bash

scriptDir=$(cd `dirname $0`; pwd)
cd $scriptDir

if [ ! -e node_modules ]; then
    ln -s ../web/node_modules node_modules
fi

if [ -e ../server ]; then
    rm -fr ../server
fi

npm run build-services
cp -f legacy/init.js ../server/
node webpack-task/attach-console-definition.js

