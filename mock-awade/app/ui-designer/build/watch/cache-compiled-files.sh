#!/bin/bash

scriptDir=$(cd $(dirname $0);pwd)
cd $scriptDir

if [ ! -e compiled/version.txt ]; then
    echo "the compiled files are not ready!"
    exit 1
fi

tsc --lib es2016 --outDir dist src/watch.ts && node dist/build/watch/src/watch.js compile-only

version=`cat compiled/version.txt`
rm -f compiled-v$version.zip
cd compiled
zip -r -9 ../compiled-v$version.zip *

echo "file saved: compiled-v$version.zip"
