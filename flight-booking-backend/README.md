# Flight Booking Backend API

Backend API for Flight Booking Mobile App using Node.js, Express, and MariaDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure .env file (set DB_PASSWORD)

3. Create database in HeidiSQL:
   - Open HeidiSQL
   - Execute database/init.sql

4. Start development server:
```bash
npm run dev
```

## API Endpoints

- GET  / - API info
- GET  /api/health - Health check

## Tech Stack

- Node.js + Express
- MariaDB + Sequelize
- JWT Authentication
