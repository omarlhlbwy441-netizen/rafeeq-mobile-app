# Contributing to Rafeeq

Thank you for your interest in contributing to رفيق! 🐺

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/rafeeq-mobile-app.git`
3. Create a branch: `git checkout -b feature/your-feature`

## Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Mobile App
```bash
npm install
npx expo start
```

## Code Style

- Python: Follow PEP 8, use `black` for formatting
- TypeScript: Follow the existing patterns, use meaningful names
- Commit messages: Use clear, descriptive messages in English or Arabic

## Testing

```bash
cd backend
pytest -v
```

## Pull Request Process

1. Ensure tests pass
2. Update documentation if needed
3. Create PR with clear description
4. Wait for review

## Code of Conduct

Be respectful, constructive, and inclusive.

---
**Powered by Wolf Digital Kingdom**
