@echo off

set pwd=%cd%
cd /d %~dp0

set PATH=%cd%\node_modules\.bin;%PATH%
cmd /c gulp basics:build-release:clean

pause