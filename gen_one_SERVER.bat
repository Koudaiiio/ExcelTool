cd /d %~dp0
node aa.js dir=g_sql target=sql excelDir=%1
node aa.js dir=g_csv target=csv excelDir=%1
pause
:://可以拖拽单个excel文件到此bat上， 可以生成对应的csv和sql文件