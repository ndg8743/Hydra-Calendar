# Hydra Calendar - Docker Setup

This guide explains how to run the Hydra Calendar application using Docker with Nginx.

## Prerequisites

- Docker Desktop for Windows
- Docker Compose
- PowerShell (included with Windows)

## Quick Start

### Development Environment

1. **Clone and navigate to the project:**
   ```powershell
   cd "C:\Users\nateg\OneDrive\Desktop\Hydra-Calender"
   ```

2. **Run the development setup:**
   ```powershell
   .\dev.ps1
   ```

3. **Access the application:**
   - Calendar App: http://localhost:8000
   - phpMyAdmin: http://localhost:8080
   - Mailpit (Email testing): http://localhost:8025

### Production Build

1. **Build for production:**
   ```powershell
   .\build.ps1
   ```

2. **Or manually:**
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## Architecture

### Docker Services

- **app**: Laravel application with Nginx + PHP-FPM
- **db**: MySQL 8.0 database
- **phpmyadmin**: Database administration interface
- **redis**: Cache and session storage (dev only)
- **mailpit**: Email testing service (dev only)

### Technology Stack

- **Web Server**: Nginx
- **PHP Runtime**: PHP 8.2 FPM
- **Process Manager**: Supervisor
- **Database**: MySQL 8.0
- **Frontend**: React + Inertia.js
- **CSS Framework**: Tailwind CSS

## Configuration Files

### Docker Configuration

- `Dockerfile` - Development container
- `Dockerfile.prod` - Production-optimized container
- `docker-compose.yml` - Base services
- `docker-compose.override.yml` - Development overrides
- `docker/nginx.conf` - Nginx web server configuration
- `docker/php-fpm.conf` - PHP-FPM process manager
- `docker/supervisord.conf` - Process supervisor

### Environment

- `.env.example` - Environment variables template
- `.env` - Local environment (created automatically)

## Commands

### Start Services
```powershell
docker-compose up -d
```

### Stop Services
```powershell
docker-compose down
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

### Access Container
```powershell
docker-compose exec app bash
```

### Run Laravel Commands
```powershell
# Run migrations
docker-compose exec app php artisan migrate

# Clear cache
docker-compose exec app php artisan cache:clear

# Generate application key
docker-compose exec app php artisan key:generate
```

### Database Commands
```powershell
# Access MySQL CLI
docker-compose exec db mysql -u hydra_user -p hydra_calendar

# Backup database
docker-compose exec db mysqldump -u hydra_user -p hydra_calendar > backup.sql

# Restore database
docker-compose exec -T db mysql -u hydra_user -p hydra_calendar < backup.sql
```

## Performance Optimizations

### Nginx Configuration
- Gzip compression enabled
- Static file caching
- Security headers
- Optimized FastCGI parameters

### PHP-FPM Configuration
- Dynamic process management
- Optimized worker processes
- Memory usage optimization

### Laravel Optimizations
- Route caching
- Configuration caching
- View caching
- Autoloader optimization

## Security Features

- Security headers (XSS, CSRF, etc.)
- Hidden file protection
- Environment file protection
- Process isolation
- Non-root user execution

## Deployment

### Production Deployment
```powershell
# Build production image
docker build -f Dockerfile.prod -t hydra-calendar:latest .

# Run production container
docker run -d -p 80:80 --name hydra-calendar hydra-calendar:latest
```

### Health Monitoring
The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-06T18:00:00.000Z",
  "app": "Hydra Calendar",
  "version": "1.0.0"
}
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 8000, 3307, or 8080 are in use, modify `docker-compose.override.yml`

2. **Permission issues**: Run PowerShell as Administrator if needed

3. **Container build fails**: Clear Docker cache:
   ```powershell
   docker system prune -a
   ```

4. **Database connection issues**: Ensure containers are fully started:
   ```powershell
   docker-compose ps
   ```

### Logs and Debugging

View detailed logs:
```powershell
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f db

# All services
docker-compose logs -f
```

## Development Workflow

1. **Make code changes** - Files are mounted, changes reflect immediately
2. **Frontend changes** - Run `npm run dev` in container for hot reload
3. **Database changes** - Use migrations: `php artisan make:migration`
4. **Clear caches** - `php artisan optimize:clear` when needed

## File Structure

```
/docker/
  ├── nginx.conf          # Nginx configuration
  ├── php-fpm.conf        # PHP-FPM configuration
  └── supervisord.conf    # Process supervisor

/scripts/
  ├── build.ps1           # Production build script
  └── dev.ps1             # Development start script

Dockerfile               # Development container
Dockerfile.prod         # Production container
docker-compose.yml      # Base services
docker-compose.override.yml  # Development overrides
```
