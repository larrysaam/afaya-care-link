#!/usr/bin/env pwsh
# Quick Links - Opens all necessary Supabase Dashboard pages

Write-Host "`n🚀 Opening Supabase Dashboard Links..." -ForegroundColor Cyan
Write-Host ""

$urls = @(
    @{
        Name = "API Keys (GET YOUR KEY HERE!)"
        Url = "https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/settings/api"
    },
    @{
        Name = "Authentication URL Configuration"
        Url = "https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/auth/url-configuration"
    },
    @{
        Name = "Auth Providers"
        Url = "https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/auth/providers"
    },
    @{
        Name = "Storage Buckets"
        Url = "https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/storage/buckets"
    },
    @{
        Name = "SQL Editor"
        Url = "https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm/sql/new"
    }
)

foreach ($item in $urls) {
    Write-Host "📂 Opening: $($item.Name)" -ForegroundColor Yellow
    Start-Process $item.Url
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "✅ All dashboard pages opened in your browser!" -ForegroundColor Green
Write-Host ""
Write-Host "FIRST: Get your API key from the first tab that opened" -ForegroundColor Cyan
Write-Host "THEN: Update your .env file with the key" -ForegroundColor Cyan
Write-Host "FINALLY: Run .\verify-setup.ps1 to check your setup" -ForegroundColor Cyan
Write-Host ""
