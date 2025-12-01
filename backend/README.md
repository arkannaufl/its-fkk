# Backend API - Laravel 12

Laravel 12 REST API untuk ITS (Integrated Task System).

## 📋 Requirements

- PHP >= 8.2
- Composer
- Node.js & NPM
- Database: MySQL/MariaDB/PostgreSQL/SQLite

## 🚀 Quick Start

### 1. Install Dependencies

```bash
composer install
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup

Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=its_fkk
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrations:
```bash
php artisan migrate
php artisan db:seed
```

### 4. Storage Setup

```bash
php artisan storage:link
```

### 5. Run Server

```bash
# Development
composer run dev

# Or separately
php artisan serve
npm run dev
```

Server: `http://127.0.0.1:8000`

## 📚 API Endpoints

### Public Routes

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/auth/login` | User login | 10/min |
| POST | `/api/auth/check-session` | Check active session | 20/min |
| POST | `/api/auth/password/reset/request` | Request OTP | 5/min |
| POST | `/api/auth/password/reset/verify` | Verify OTP | 10/min |
| POST | `/api/auth/password/reset` | Reset password | 5/min |

### Protected Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |
| POST | `/api/auth/avatar` | Upload avatar |
| DELETE | `/api/auth/avatar` | Delete avatar |

## 🔐 Authentication

Semua protected routes memerlukan Bearer token:

```
Authorization: Bearer {token}
```

Token expires setelah 24 jam dan dapat di-refresh.

## 🔒 Security

### Password Policy

- Minimal 8 karakter
- Minimal 1 huruf besar (A-Z)
- Minimal 1 huruf kecil (a-z)
- Minimal 1 angka (0-9)
- Minimal 1 karakter khusus (@$!%*#?&)

### Rate Limiting

- Login: 10 requests/minute
- Password reset: 5 requests/minute
- Custom: 5 failed attempts = 5 minutes lockout

### Security Headers

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy (production)
- Strict-Transport-Security (HTTPS)

## 💾 Caching

Menggunakan **Database Cache** (default).

```env
CACHE_STORE=database
```

**Features:**
- User data caching (5 menit TTL)
- Rate limiting storage
- Auto-cleanup expired entries
- Cache invalidation pada semua update operations

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test tests/Feature/AuthTest.php
```

## 📦 Database

### Migrations

```bash
php artisan migrate
php artisan migrate:fresh --seed
```

### Indexes

Database sudah dioptimasi dengan indexes untuk performa optimal.

## 📝 Environment Variables

```env
APP_NAME="ITS"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=its_fkk
DB_USERNAME=root
DB_PASSWORD=

CACHE_STORE=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_FROM_ADDRESS="noreply@umj.ac.id"
MAIL_FROM_NAME="ITS"

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,127.0.0.1:8000
```

## 👥 Default Users

| Role | Email | Password | Username |
|------|-------|----------|----------|
| Admin | admin@umj.ac.id | admin123 | admin |
| Dekan | dekan@umj.ac.id | dekan123 | dekan |
| Unit | unit@umj.ac.id | unit123 | unit |
| SDM | sdm@umj.ac.id | sdm123 | sdm |

**⚠️ WARNING**: Ganti password default di production!

## 🚀 Production Deployment

```bash
# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set environment
APP_ENV=production
APP_DEBUG=false
```

## 📄 License

MIT License
