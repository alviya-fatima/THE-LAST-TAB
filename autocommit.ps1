$ErrorActionPreference = "SilentlyContinue"
$repo = $PSScriptRoot
$log = Join-Path $repo ".git\autocommit.log"

Set-Location -LiteralPath $repo

$status = git status --porcelain
if (-not $status) { return }

git add -A
git commit -m "Auto-commit $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-Null
$pushOutput = git push origin HEAD 2>&1
$result = if ($LASTEXITCODE -eq 0) { "pushed" } else { "push failed: $pushOutput" }
Add-Content -LiteralPath $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $result"
