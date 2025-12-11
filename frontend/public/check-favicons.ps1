# Favicon Generator Script
# This script helps generate favicons from the BD Supershop logo

Write-Host "BD Supershop Favicon Generator" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$publicPath = "."

Write-Host "Quick Setup:" -ForegroundColor Yellow
Write-Host "1. Go to: https://realfavicongenerator.net/"
Write-Host "2. Upload your BD Supershop logo image"
Write-Host "3. Click 'Generate your Favicons and HTML code'"
Write-Host "4. Download the generated package"
Write-Host "5. Extract and copy these files here:"
Write-Host "   - favicon-16x16.png"
Write-Host "   - favicon-32x32.png"
Write-Host "   - apple-touch-icon.png"
Write-Host "   - android-chrome-192x192.png"
Write-Host "   - android-chrome-512x512.png"
Write-Host ""

# Check if files exist
$files = @(
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png"
)

Write-Host "Checking for favicon files..." -ForegroundColor Cyan
$allExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
        $allExist = $false
    }
}

if ($allExist) {
    Write-Host ""
    Write-Host "All favicon files are present! ✓" -ForegroundColor Green
    Write-Host "Run 'git add *.png && git commit -m \"Add favicon files\" && git push' to deploy"
} else {
    Write-Host ""
    Write-Host "Please generate and add the missing favicon files." -ForegroundColor Yellow
}
