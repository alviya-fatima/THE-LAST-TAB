$mutex = New-Object System.Threading.Mutex($false, "Global\THE_LAST_TAB_AUTOCOMMIT")
if (-not $mutex.WaitOne(0)) { exit }

$script = Join-Path $PSScriptRoot "autocommit.ps1"
while ($true) {
    try { & $script } catch { }
    Start-Sleep -Seconds 30
}
