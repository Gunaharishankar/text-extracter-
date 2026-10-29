@echo off
echo Starting Apache Tika Server on port 9998...
java -jar "%USERPROFILE%\Downloads\tika-server-standard-2.9.2.jar" -h 0.0.0.0 -p 9998
pause
