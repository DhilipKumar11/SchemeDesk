# SchemeDesk Quick Start Script
# Run this to set up and start the demo

Write-Host "🚀 SchemeDesk Setup & Demo Launcher" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "`nChecking PostgreSQL..." -ForegroundColor Yellow
$pgVersion = psql --version 2>$null
if ($pgVersion) {
    Write-Host "✅ PostgreSQL installed: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL not found in PATH" -ForegroundColor Yellow
    Write-Host "   If PostgreSQL is installed, add it to PATH" -ForegroundColor Yellow
    Write-Host "   Or install from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    $continue = Read-Host "`nContinue anyway? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

Write-Host "`n📋 Setup Steps:" -ForegroundColor Cyan
Write-Host "===============`n" -ForegroundColor Cyan

# Step 1: Database Setup
Write-Host "Step 1: Database Setup" -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow
Write-Host "You need to manually run these commands in a separate terminal:`n"
Write-Host "  createdb schemedesk" -ForegroundColor White
Write-Host "  psql -d schemedesk -f database/schema.sql" -ForegroundColor White
Write-Host "  psql -d schemedesk -f database/seed.sql`n" -ForegroundColor White

$dbDone = Read-Host "Have you completed the database setup? (y/n)"
if ($dbDone -ne "y") {
    Write-Host "`n⚠️  Please complete database setup first, then run this script again." -ForegroundColor Yellow
    exit 0
}

# Step 2: Backend Setup
Write-Host "`nStep 2: Starting Backend..." -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Yellow

Write-Host "Opening backend in new terminal..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\My Projects\SchemeDesk\backend'; Write-Host '🔧 Starting Backend Server...' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 3

# Step 3: Frontend Setup
Write-Host "`nStep 3: Starting Frontend..." -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Yellow

Write-Host "Opening frontend in new terminal..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\My Projects\SchemeDesk\frontend'; Write-Host '🎨 Starting Frontend Server...' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 2

# Step 4: Open Browser
Write-Host "`nStep 4: Opening Browser..." -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow

Start-Sleep -Seconds 5
Write-Host "Opening http://localhost:3000 in your browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "`n✅ SchemeDesk is starting!" -ForegroundColor Green
Write-Host "========================`n" -ForegroundColor Green

Write-Host "📝 Demo Instructions:" -ForegroundColor Cyan
Write-Host "1. Wait for both servers to start (check the new terminal windows)" -ForegroundColor White
Write-Host "2. Browser will open automatically to http://localhost:3000" -ForegroundColor White
Write-Host "3. Click 'Register' to create a new account" -ForegroundColor White
Write-Host "4. Fill in your profile details" -ForegroundColor White
Write-Host "5. Explore eligible schemes and apply!`n" -ForegroundColor White

Write-Host "📚 For detailed demo guide, see: DEMO_GUIDE.md`n" -ForegroundColor Yellow

Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
