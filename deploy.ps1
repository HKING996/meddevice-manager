param(
  [Parameter(Mandatory=$true)][string]$Token,
  [string]$RepoName = "meddevice-manager"
)

$ErrorActionPreference = "Stop"
$headers = @{
  Authorization = "Bearer $Token"
  Accept = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
}

Write-Host "==> Verifying token and detecting account..."
$user = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers
$owner = $user.login
Write-Host "    Account: $owner"

Write-Host "==> Creating repository '$RepoName' (if not exists)..."
$body = @{ name=$RepoName; private=$false; description="MedDevice Manager PWA - medical asset inventory" } | ConvertTo-Json
try {
  Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body | Out-Null
  Write-Host "    Repository created."
} catch {
  Write-Host "    Repository may already exist, continuing..."
}

Write-Host "==> Preparing git and pushing files..."
Set-Location $PSScriptRoot
git init | Out-Null
git config user.email "deployer@local"
git config user.name "Deploy Bot"
git add .
git commit -m "Deploy MedDevice PWA" 2>&1 | Out-Null
git branch -M main
$authRemote = "https://$owner`:$Token@github.com/$owner/$RepoName.git"
git remote remove origin 2>$null
git remote add origin $authRemote
git push -u origin main --force 2>&1 | Out-Null
git remote set-url origin "https://github.com/$owner/$RepoName.git"
Write-Host "    Files pushed."

Write-Host "==> Enabling GitHub Pages..."
$pagesBody = @{ source=@{ branch="main"; path="/" } } | ConvertTo-Json
try {
  Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$RepoName/pages" -Method Post -Headers $headers -Body $pagesBody | Out-Null
  Write-Host "    Pages enabled."
} catch {
  Write-Host "    Pages may already be enabled, continuing..."
}

Write-Host ""
Write-Host "===================================================="
Write-Host " DONE! Wait 1-3 minutes, then open on your phone:"
Write-Host " https://$owner.github.io/$RepoName/"
Write-Host "===================================================="
