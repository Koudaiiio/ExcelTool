node --max-old-space-size=1500 aa.js dir=g_ts target=ts excelDir=../Design/develop
::@echo off
::set arg1=%1
::
::cd %~dp0
::if "%arg1%"=="" (
::    echo "null args"
::::    node aa.js dir=g_ts target=ts excelDir=../Design/develop
::) else (
::    echo arg1 is "%arg1%"
::    
::    node aa.js dir=g_ts target=ts excelDir=%1
::)
::pause