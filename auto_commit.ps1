## Auto-commit & push script for the AI Incident Management Dashboard
# Save this as auto_commit.ps1 in the project root and run it in PowerShell.
# It will monitor the repository for any changes, automatically commit, and push to GitHub.
# Adjust the sleep interval (in seconds) if you want more/less frequent checks.

$gitPath = "C:\Program Files\Git\cmd\git.exe"
$repoPath = "c:\Users\sujit\OneDrive\Documents\pilot\AI Incident Management Dashboard"
$intervalSeconds = 30

Write-Host "=== Auto-Commit & Push Watcher Started ===" -ForegroundColor Green
Write-Host "Checking for changes every $intervalSeconds seconds..."
Write-Host "Press Ctrl+C to stop.`n"

while ($true) {
    Set-Location $repoPath
    # Stage all changes
    & $gitPath add -A
    # Check if there are staged changes
    $null = & $gitPath diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $msg = "Auto commit $timestamp"
        & $gitPath commit -m $msg
        Write-Host "Committed: $msg" -ForegroundColor Cyan

        # Push to GitHub
        & $gitPath push origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Pushed to GitHub successfully!" -ForegroundColor Green
        } else {
            Write-Host "Push failed! Will retry next cycle." -ForegroundColor Red
        }
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] No changes detected."
    }
    Start-Sleep -Seconds $intervalSeconds
}
