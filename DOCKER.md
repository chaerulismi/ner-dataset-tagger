# Docker Deployment Guide

This guide explains how to deploy the NER Dataset Creator web app using Docker.

## 🐳 Quick Start

### Development Environment

1. **Build and run with Docker Compose:**
```bash
# Build and start the application
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f
```

2. **Access the application:**
   - Open your browser and go to `http://localhost:5000`

### Production Environment

1. **Build and run production version:**
```bash
# Build and start production container
docker-compose -f docker-compose.prod.yml up --build

# Run in background
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔧 Manual Docker Commands

### Build Image
```bash
# Development build
docker build -t ner-dataset-creator:dev .

# Production build
docker build -f Dockerfile.prod -t ner-dataset-creator:prod .
```

### Run Container
```bash
# Development
docker run -p 5000:5000 ner-dataset-creator:dev

# Production
docker run -p 5000:5000 ner-dataset-creator:prod

# With custom port
docker run -p 8080:5000 -e PORT=5000 ner-dataset-creator:prod
```

### Stop and Cleanup
```bash
# Stop containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove images
docker rmi ner-dataset-creator:dev ner-dataset-creator:prod
```

## 📁 Volume Management

The application uses Docker volumes for data persistence:

- **`ner_data`**: Stores application data and datasets
- **`exports`**: Exported files are created in temporary directories and automatically cleaned up

### Backup Data
```bash
# Backup application data
docker run --rm -v ner_data:/data -v $(pwd):/backup alpine tar czf /backup/ner_data_backup.tar.gz -C /data .
```

### Restore Data
```bash
# Restore application data
docker run --rm -v ner_data:/data -v $(pwd):/backup alpine tar xzf /backup/ner_data_backup.tar.gz -C /data
```

## 🌐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `production` | Flask environment mode |
| `FLASK_APP` | `app.py` | Flask application file |
| `PORT` | `5000` | Port to bind to |

### Custom Environment
```bash
# Create .env file
echo "FLASK_ENV=development" > .env
echo "PORT=8080" >> .env

# Use with docker-compose
docker-compose --env-file .env up
```

## 🚀 Production Deployment

### Using Docker Compose
```bash
# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Scale if needed
docker-compose -f docker-compose.prod.yml up -d --scale ner-dataset-creator=3
```

### Using Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml ner-stack

# List services
docker service ls

# Scale service
docker service scale ner-stack_ner-dataset-creator=3
```

## 🔍 Monitoring and Logs

### View Logs
```bash
# Container logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f ner-dataset-creator

# Production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Health Check
The application includes a health check endpoint:
```bash
# Check health
curl http://localhost:5000/

# Health check status
docker inspect ner-dataset-creator | grep -A 10 Health
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

2. **Permission issues:**
```bash
# Fix volume permissions
sudo chown -R $USER:$USER /var/lib/docker/volumes/
```

3. **Container won't start:**
```bash
# Check container logs
docker logs ner-dataset-creator

# Check container status
docker ps -a
```

### Debug Mode
```bash
# Run with debug output
docker-compose up --build --force-recreate

# Access container shell
docker exec -it ner-dataset-creator /bin/bash
```

## 📊 Performance Tuning

### Gunicorn Configuration
The production Dockerfile uses Gunicorn with these settings:
- **Workers**: 4 (adjust based on CPU cores)
- **Timeout**: 120 seconds
- **Bind**: 0.0.0.0:5000

### Resource Limits
Production compose file includes resource limits:
- **CPU**: 0.5-1.0 cores
- **Memory**: 512MB-1GB

### Custom Gunicorn Settings
```bash
# Override Gunicorn settings
docker run -e GUNICORN_WORKERS=8 -e GUNICORN_TIMEOUT=60 ner-dataset-creator:prod
```

## 🔒 Security Considerations

- **Non-root user**: Container runs as `app` user
- **Health checks**: Regular health monitoring
- **Resource limits**: Prevents resource exhaustion
- **Volume isolation**: Data persistence with proper permissions

## 📝 Next Steps

1. **Set up reverse proxy** (nginx/traefik) for SSL termination
2. **Configure monitoring** (Prometheus, Grafana)
3. **Set up CI/CD** pipeline for automated deployments
4. **Implement backup strategy** for data volumes
5. **Add load balancing** for high availability
