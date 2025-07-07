# Hydra Calendar Build Script for Windows
# This script builds and runs the Hydra Calendar application

Write-Host "Building Hydra Calendar Application..." -ForegroundColor Green

# Check if Docker is running
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running or not installed" -ForegroundColor Red
    exit 1
}

# Check if docker-compose is available
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    
    # Generate Laravel application key
    $appKey = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString().Replace("-", "")))
    (Get-Content ".env") -replace "APP_KEY=", "APP_KEY=base64:$appKey" | Set-Content ".env"
    Write-Host "✅ .env file created with application key" -ForegroundColor Green
}

# Build and start containers
Write-Host "Building Docker containers..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host "Starting containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait for containers to be ready
Write-Host "Waiting for containers to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Run Laravel setup commands
Write-Host "Running Laravel setup..." -ForegroundColor Yellow
docker-compose exec app composer install --optimize-autoloader --no-dev
docker-compose exec app php artisan key:generate --force
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed --force
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache
docker-compose exec app npm install
docker-compose exec app npm run build

Write-Host ""
Write-Host "🎉 Hydra Calendar is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "  📅 Main App: http://localhost:8000" -ForegroundColor White
Write-Host "  🗄️  phpMyAdmin: http://localhost:8080" -ForegroundColor White
Write-Host "  📧 Mailpit: http://localhost:8025" -ForegroundColor White
Write-Host ""
Write-Host "To stop the application, run: docker-compose down" -ForegroundColor Yellow
