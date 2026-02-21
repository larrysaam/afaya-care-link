#!/usr/bin/env pwsh
# Verify Supabase Setup Script
# This script checks if your Supabase configuration is complete

Write-Host "`n=== Afaya CareLink - Supabase Setup Verification ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "   Create it from .env.template" -ForegroundColor Yellow
    exit 1
}

# Read .env file
$envContent = Get-Content ".env" -Raw

# Check if placeholder key is still there
if ($envContent -match "PASTE_YOUR_ANON_PUBLIC_KEY_HERE") {
    Write-Host "❌ Supabase API Key not configured!" -ForegroundColor Red
    Write-Host ""
    Write-Host "NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/settings/api" -ForegroundColor White
    Write-Host "2. Copy the 'anon' 'public' key" -ForegroundColor White
    Write-Host "3. Replace 'PASTE_YOUR_ANON_PUBLIC_KEY_HERE' in .env file" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Extract the API key
if ($envContent -match 'VITE_SUPABASE_PUBLISHABLE_KEY="([^"]+)"') {
    $apiKey = $matches[1]
    
    # Check if it looks like a valid key (starts with eyJ)
    if ($apiKey -match "^eyJ") {
        Write-Host "✅ API Key is configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  API Key doesn't look valid (should start with 'eyJ')" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Could not parse API Key from .env" -ForegroundColor Red
    exit 1
}

# Check project ID
if ($envContent -match 'VITE_SUPABASE_PROJECT_ID="yfzpcyppnobbqbpsedtm"') {
    Write-Host "✅ Project ID is correct (yfzpcyppnobbqbpsedtm)" -ForegroundColor Green
} else {
    Write-Host "❌ Project ID mismatch or not found" -ForegroundColor Red
}

# Check URL
if ($envContent -match 'VITE_SUPABASE_URL="https://yfzpcyppnobbqbpsedtm.supabase.co"') {
    Write-Host "✅ Supabase URL is correct" -ForegroundColor Green
} else {
    Write-Host "❌ Supabase URL mismatch or not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Checking Supabase CLI ===" -ForegroundColor Cyan

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Supabase CLI is installed: $supabaseVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Supabase CLI not found" -ForegroundColor Yellow
    Write-Host "   Install from: https://supabase.com/docs/guides/cli" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Project Link Status ===" -ForegroundColor Cyan

# Check if project is linked
if (Test-Path ".supabase/config.toml") {
    Write-Host "✅ Project appears to be linked" -ForegroundColor Green
} else {
    Write-Host "⚠️  Project not linked to Supabase CLI" -ForegroundColor Yellow
    Write-Host "   Run: supabase link --project-ref yfzpcyppnobbqbpsedtm" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan

if ($envContent -match "PASTE_YOUR_ANON_PUBLIC_KEY_HERE") {
    Write-Host "1. Get your API key from Supabase Dashboard" -ForegroundColor White
    Write-Host "2. Update .env file with the key" -ForegroundColor White
    Write-Host "3. Run this script again to verify" -ForegroundColor White
} else {
    Write-Host "1. Link project: supabase link --project-ref yfzpcyppnobbqbpsedtm" -ForegroundColor White
    Write-Host "2. Push schema: supabase db push" -ForegroundColor White
    Write-Host "3. Set up storage: Run setup-storage.sql in Supabase SQL Editor" -ForegroundColor White
    Write-Host "4. Configure Auth settings in Supabase Dashboard" -ForegroundColor White
    Write-Host "5. Start dev server: npm run dev" -ForegroundColor White
}

Write-Host ""
Write-Host "For detailed instructions, see QUICK_START.md" -ForegroundColor Cyan
Write-Host ""
