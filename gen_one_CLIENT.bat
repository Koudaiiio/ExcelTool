cd /d %~dp0
node aa.js dir=g_json target=json excelDir=%1
node aa.js dir=g_ts target=ts excelDir=%1
pause
:://可以拖拽单个excel文件到此bat上， 可以生成对应的json和ts文件