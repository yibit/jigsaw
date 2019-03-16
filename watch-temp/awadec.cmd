@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\awadec" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\awadec" %*
)

