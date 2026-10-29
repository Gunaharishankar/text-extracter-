Write-Host "Starting Apache Tika Server on port 9998..." -ForegroundColor Cyan
$jarPath = "$env:USERPROFILE\Downloads\tika-server-standard-2.9.2.jar"
if (-not (Test-Path $jarPath)) {
    Write-Host "Error: Tika jar not found at $jarPath" -ForegroundColor Red
    exit 1
}
java -jar $jarPath -h 0.0.0.0 -p 9998
