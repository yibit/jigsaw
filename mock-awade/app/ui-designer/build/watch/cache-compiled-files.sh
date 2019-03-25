#!/bin/bash

scriptDir=$(cd $(dirname $0);pwd)

echo "recompiling web without any hashing ..."
cd $scriptDir/../../web/
./node_modules/.bin/ng b --output-hashing=none -op=out/vmax-studio/awade -bh=/vmax-studio/awade/
if [ "$?" != "0" ]; then
    echo "Error: unable to compile web!"
    exit 1
fi

echo "compile watcher and compile all files, it needs 5+ minutes, take a cup of tea and wait ..."
cd $scriptDir
rm -fr compiled
if [ ! -e node_modules ]; then
    ln -s ../../web/node_modules node_modules
fi

chmod +x ./node_modules/.bin/tsc
./node_modules/.bin/tsc --lib es2016 --outDir dist src/watch.ts
if [ "$?" != "0" ]; then
    echo "Error: unable to compile watcher!"
    exit 1
fi

node dist/build/watch/src/watch.js compile-only
if [ "$?" != "0" ]; then
    echo "Error: unable to compile project files!"
    exit 1
fi
if [ ! -e compiled/version.txt ]; then
    echo "Error: the compiled files are not ready!"
    exit 1
fi

echo "packing everything up, this should be fast"
version=`cat compiled/version.txt`
rm -fr /tmp/awade-watch-build-tmp
mkdir -p /tmp/awade-watch-build-tmp
cd /tmp/awade-watch-build-tmp/
cp -r $scriptDir/compiled ./
cp -r $scriptDir/../../web/out/vmax-studio/awade ./
outZip=$scriptDir/compiled-v$version.zip
rm -f $outZip
zip -r -9 $outZip *

echo "everything seems find, the package should be at"
echo $outZip
