# Hydra Calendar Development Script
# Quick start for development

Write-Host "Starting Hydra Calendar in Development Mode..." -ForegroundColor Green

# Start containers
docker-compose up -d

Write-Host ""
Write-Host "🚀 Development environment started!" -ForegroundColor Green
Write-Host ""
Write-Host "Available services:" -ForegroundColor Cyan
Write-Host "  📅 Calendar App: http://localhost:8000" -ForegroundColor White
Write-Host "  🗄️  phpMyAdmin: http://localhost:8080" -ForegroundColor White
Write-Host "  📧 Mailpit: http://localhost:8025" -ForegroundColor White
Write-Host "  🔴 Redis: localhost:6379" -ForegroundColor White
Write-Host "  🗃️  MySQL: localhost:3307" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f app    # View app logs" -ForegroundColor Gray
Write-Host "  docker-compose exec app bash  # Access app container" -ForegroundColor Gray
Write-Host "  docker-compose down           # Stop all services" -ForegroundColor Gray
