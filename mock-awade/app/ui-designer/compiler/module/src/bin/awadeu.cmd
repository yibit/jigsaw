@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\awadeu" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\awadeu" %*
)

