# ⚡ Quick Setup Script for New Supabase Project
# Project ID: yfzpcyppnobbqbpsedtm

Write-Host "🚀 AfayaConekt - Supabase Migration Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
Write-Host "📦 Checking Supabase CLI..." -ForegroundColor Yellow
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Run: npm install -g supabase" -ForegroundColor Yellow
    npm install -g supabase
} else {
    Write-Host "✅ Supabase CLI is installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Setup Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Get your Supabase credentials:" -ForegroundColor Yellow
Write-Host "   → Go to: https://supabase.com/dashboard/project/yfzpcyppnobbqbpsedtm" -ForegroundColor White
Write-Host "   → Settings → API" -ForegroundColor White
Write-Host "   → Copy your anon/public key" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  Update .env file:" -ForegroundColor Yellow
Write-Host "   → Open: .env" -ForegroundColor White
Write-Host "   → Update VITE_SUPABASE_PUBLISHABLE_KEY with your new key" -ForegroundColor White
Write-Host ""

$response = Read-Host "Have you updated the .env file? (y/n)"

if ($response -eq 'y') {
    Write-Host ""
    Write-Host "3️⃣  Linking to Supabase project..." -ForegroundColor Yellow
    
    supabase login
    
    Write-Host ""
    Write-Host "Linking to project yfzpcyppnobbqbpsedtm..." -ForegroundColor Yellow
    supabase link --project-ref yfzpcyppnobbqbpsedtm
    
    Write-Host ""
    Write-Host "4️⃣  Pushing database migrations..." -ForegroundColor Yellow
    supabase db push
    
    Write-Host ""
    Write-Host "✅ Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Configure Auth settings in Supabase Dashboard" -ForegroundColor White
    Write-Host "   2. Create storage bucket: hospital-images" -ForegroundColor White
    Write-Host "   3. Create admin user" -ForegroundColor White
    Write-Host "   4. Run: npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See SUPABASE_MIGRATION_GUIDE.md for detailed instructions" -ForegroundColor Yellow
    
} else {
    Write-Host ""
    Write-Host "❌ Please update .env file first, then run this script again" -ForegroundColor Red
    Write-Host ""
    Write-Host "Update these values in .env:" -ForegroundColor Yellow
    Write-Host "VITE_SUPABASE_PROJECT_ID=`"yfzpcyppnobbqbpsedtm`"" -ForegroundColor White
    Write-Host "VITE_SUPABASE_PUBLISHABLE_KEY=`"YOUR_NEW_KEY_HERE`"" -ForegroundColor White
    Write-Host "VITE_SUPABASE_URL=`"https://yfzpcyppnobbqbpsedtm.supabase.co`"" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
