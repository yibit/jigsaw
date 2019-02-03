@echo off

set pwd=%cd%

cd /d %~dp0\..\
if not exist basics\node_modules\ (
	cd basics
	mklink /d node_modules ..\web\node_modules
	cd ..
)
if not exist compiler\module\node_modules (
	cd compiler\module
	mklink /d node_modules ..\..\web\node_modules
	cd ..\..\
)
if not exist compiler\module\src\basics-src (
	cd compiler\module\src\
	mklink /d basics-src ..\..\..\basics\src
	cd ..\..\..\
)
if not exist sdk\node_modules (
	cd sdk
	mklink /d node_modules ..\web\node_modules
	cd ..\
)

if not exist services\node_modules (
	cd services\
    mklink /d node_modules ..\web\node_modules
	cd ..
)

if exist server\ (
    rd /S /Q server\
)

cd services\
set PATH=%cd%\node_modules\.bin;%PATH%

echo compiling services to server/dist/awade-services.js
echo you need to restart rdk to reload the compiled services.
cmd /c npm run build-services
set result=%errorlevel%

if exist ..\server\ (
	copy legacy\init.js ..\server\
)
node webpack-task\attach-console-definition.js

if not "%1" == "silent" (pause) 
exit %result%
