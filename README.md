# 🐺 رفيق (Rafeeq) — v3.0.0

> **Your Intelligent AI Companion** — The most powerful digital ecosystem with the strongest kernel.

[![Version](https://img.shields.io/badge/version-3.0.0-blue)](https://github.com/omarlhlbwy441-netizen/rafeeq-mobile-app)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/frontend-Expo%20%2B%20React%20Native-4630EB)](https://expo.dev)

---

## 🚀 What's New in v3.0.0

### Backend (FastAPI)
- ✅ **PostgreSQL + Asyncpg** — Full async database layer with SQLAlchemy 2.0
- ✅ **JWT Authentication** — Access & refresh tokens with session tracking & logout
- ✅ **Redis Caching** — High-performance caching layer
- ✅ **Alembic Migrations** — Database schema versioning
- ✅ **Store/Franchise System** — Multi-tenant merchant platform
- ✅ **Product Catalog** — Full CRUD with ownership checks
- ✅ **Admin Dashboard API** — System analytics & user management
- ✅ **Rate Limiting** — In-memory rate limiter (200 req/min)
- ✅ **Security Headers** — HSTS, XSS protection, CSP
- ✅ **Request Logging** — Structured JSON logging
- ✅ **Custom Exceptions** — Hierarchical exception handling
- ✅ **Pagination** — Generic paginated responses
- ✅ **Docker + Render** — Production-ready deployment
- ✅ **GitHub Actions CI/CD** — Auto-test & auto-deploy
- ✅ **Comprehensive Tests** — Pytest async test suite

### Mobile App (Expo + React Native)
- ✅ **AuthContext** — JWT management with auto-login
- ✅ **Redesigned LoginScreen** — Login/Register toggle, dark theme
- ✅ **ProfileScreen** — User info, role badge, logout
- ✅ **StoreScreen** — CRUD stores with modal, FlatList
- ✅ **DashboardScreen** — Health check, quick actions, admin gate
- ✅ **API Client** — Full TypeScript API service
- ✅ **ErrorBoundary** — Crash recovery
- ✅ **Loading Component** — Reusable spinner

### DevOps
- ✅ **Docker Compose** — API + PostgreSQL + Redis
- ✅ **Render Blueprint** — One-click deployment
- ✅ **Nginx Config** — Reverse proxy + static files
- ✅ **Makefile** — Development shortcuts
- ✅ **Procfile** — PaaS entry point

---

## 🏗️ Architecture

```
rafeeq-mobile-app/
├── 📱 Mobile App (Expo + React Native)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext, AppContext
│   │   ├── screens/        # 22+ screens
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Constants & helpers
│   ├── App.tsx
│   └── package.json
│
├── ⚙️ Backend (FastAPI)
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── config.py       # Pydantic settings
│   │   ├── database.py     # SQLAlchemy async engine
│   │   ├── models.py       # ORM models (6 tables)
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # JWT & password utils
│   │   ├── middleware.py   # Logging, Security, Rate Limit
│   │   ├── utils.py        # Helpers & validators
│   │   ├── exceptions.py   # Custom exceptions
│   │   ├── pagination.py   # Generic pagination
│   │   └── routers/
│   │       ├── auth.py     # Login/Register/Logout/Me
│   │       ├── users.py    # User management
│   │       ├── stores.py   # Franchise stores
│   │       ├── products.py # Product catalog
│   │       ├── admin.py    # Admin panel
│   │       └── health.py   # Health checks
│   ├── alembic/            # Database migrations
│   ├── tests/              # Test suite
│   ├── scripts/            # Seed data
│   ├── Dockerfile
│   └── requirements.txt
│
├── 🐳 DevOps
│   ├── docker-compose.yml
│   ├── render.yaml
│   ├── nginx.conf
│   ├── Procfile
│   └── Makefile
│
└── 📋 Project
    ├── .github/workflows/   # CI/CD
    ├── .github/ISSUE_TEMPLATE/
    ├── README.md
    ├── CONTRIBUTING.md
    ├── LICENSE
    └── .gitignore
```

---

## 🛠️ Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone
git clone https://github.com/omarlhlbwy441-netizen/rafeeq-mobile-app.git
cd rafeeq-mobile-app

# Start everything
docker-compose up --build

# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Option 2: Local Development
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup PostgreSQL & Redis, then:
alembic upgrade head
python scripts/seed.py
uvicorn app.main:app --reload

# Mobile App
cd ..
npm install
npx expo start
```

### Option 3: Render (Production)
1. Fork this repo
2. Connect to [Render](https://render.com)
3. Blueprint auto-deploys: Web Service + PostgreSQL + Redis

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Get tokens |
| POST | `/api/v1/auth/logout` | End session |
| GET | `/api/v1/auth/me` | Current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Profile |
| PATCH | `/api/v1/users/me` | Update profile |
| GET | `/api/v1/users/{id}` | User by ID |

### Stores
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/stores/` | Create store |
| GET | `/api/v1/stores/` | List all |
| GET | `/api/v1/stores/my` | My stores |
| GET | `/api/v1/stores/{id}` | Store details |
| PATCH | `/api/v1/stores/{id}` | Update store |
| DELETE | `/api/v1/stores/{id}` | Deactivate |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/products/?store_id={id}` | Create product |
| GET | `/api/v1/products/store/{id}` | Store products |
| GET | `/api/v1/products/{id}` | Product details |
| PATCH | `/api/v1/products/{id}` | Update product |
| DELETE | `/api/v1/products/{id}` | Deactivate |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Stats |
| GET | `/api/v1/admin/users` | All users |
| PATCH | `/api/v1/admin/users/{id}/activate` | Toggle user |
| GET | `/api/v1/admin/logs` | System logs |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API info |
| GET | `/api/v1` | Endpoints list |

---

## 🔐 Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0
SECRET_KEY=your-super-secret-key-min-32-chars

# Optional
ENVIRONMENT=development|production|testing
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256
```

---

## 🧪 Testing

```bash
cd backend
pytest -v                    # Run all tests
pytest tests/test_auth.py -v # Auth tests only
pytest --cov=app            # With coverage
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing`
3. Commit: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

## 🐺 Powered by Wolf Digital Kingdom

> "From Egypt, with gratitude — building the future of AI."

**[GitHub](https://github.com/omarlhlbwy441-netizen/rafeeq-mobile-app)** | **Version 3.0.0** | **2026**
