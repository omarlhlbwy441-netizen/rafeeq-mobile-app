# رفيق (Rafeeq) — v3.0.0

> **Your Intelligent AI Companion** — The most powerful digital ecosystem with the strongest kernel.

## 🚀 What's New in v3.0.0

- **PostgreSQL + Asyncpg** — Full async database layer
- **JWT Authentication** — Access & refresh tokens with session tracking
- **Redis Caching** — High-performance caching layer
- **Alembic Migrations** — Database schema versioning
- **Store/Franchise System** — Multi-tenant merchant platform
- **Admin Dashboard API** — System analytics & user management
- **Docker + Render** — Production-ready deployment
- **Comprehensive Tests** — Pytest async test suite

## 🏗️ Architecture

```
rafeeq-mobile-app/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── config.py        # Pydantic settings
│   │   ├── database.py      # SQLAlchemy async engine
│   │   ├── models.py        # ORM models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # JWT & password utils
│   │   └── routers/
│   │       ├── auth.py      # Login/Register/Logout
│   │       ├── users.py     # User management
│   │       ├── stores.py    # Franchise stores
│   │       ├── products.py  # Product catalog
│   │       ├── admin.py     # Admin panel
│   │       └── health.py    # Health checks
│   ├── alembic/             # Database migrations
│   ├── tests/               # Test suite
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
├── render.yaml
└── README.md
```

## 🛠️ Quick Start

### Docker (Recommended)
```bash
docker-compose up --build
```

### Local Development
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set up PostgreSQL & Redis, then:
alembic upgrade head
uvicorn app.main:app --reload
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/rafeeq
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-super-secret-key
ENVIRONMENT=development
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create new account |
| POST | `/api/v1/auth/login` | Authenticate |
| POST | `/api/v1/auth/logout` | End session |
| GET | `/api/v1/auth/me` | Current user |
| GET | `/api/v1/users/me` | Profile |
| PATCH | `/api/v1/users/me` | Update profile |
| POST | `/api/v1/stores/` | Create store |
| GET | `/api/v1/stores/` | List stores |
| GET | `/api/v1/stores/my` | My stores |
| POST | `/api/v1/products/` | Create product |
| GET | `/api/v1/products/store/{id}` | Store products |
| GET | `/api/v1/admin/dashboard` | Admin stats |
| GET | `/health` | Health check |

## 🐺 Powered by Wolf Digital Kingdom

---
**License:** MIT | **Version:** 3.0.0 | **2026**
