.PHONY: dev test migrate lint format

# Development
dev:
	cd backend && uvicorn app.main:app --reload

# Testing
test:
	cd backend && pytest -v

# Database migrations
migrate:
	cd backend && alembic upgrade head

makemigrations:
	cd backend && alembic revision --autogenerate -m "$(msg)"

# Docker
docker-up:
	docker-compose up --build -d

docker-down:
	docker-compose down

# Linting & Formatting
lint:
	cd backend && flake8 app tests

format:
	cd backend && black app tests
