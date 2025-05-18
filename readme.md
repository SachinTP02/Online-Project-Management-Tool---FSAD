# Online Project Management Tool

A full-stack project management application with a Spring Boot backend and a React frontend. This tool allows users to register, log in, and manage projects, tasks, milestones, and reports efficiently.

## Features
- User authentication (register/login)
- Project, task, milestone, and report management
- Modern React frontend (React 18, React Router v6)
- Secure Spring Boot backend (JWT, MySQL)
- RESTful API

## Project Structure
```
Online-Project-Management-Tool---FSAD/
├── frontend/      # React app (UI)
├── server/        # Spring Boot backend
├── package.json   # Root (empty or scripts only)
├── .gitignore     # Global ignores
└── README.md      # This file
```

## Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+

## Setup & Run

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd Online-Project-Management-Tool---FSAD
git checkout added-frontend-and-auth-pages
```

### 2. Backend (Spring Boot)
- Configure MySQL in `server/src/main/resources/application.properties` (default: `opm_db`, user: `opm_user`, pass: `opm_pass`)
- Start MySQL and ensure the database exists
- Run backend:
```sh
cd server
./mvnw spring-boot:run
```

### 3. Frontend (React)
```sh
cd ../frontend
npm install
npm start
```
- The app will open at [http://localhost:3000](http://localhost:3000)

### 4. API Endpoints
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Projects, tasks, milestones, reports: see backend controllers

### 5. Database
- MySQL tables are auto-created. See `server/src/main/resources/application.properties` for config.

## Development
- Feature branches use `kebab-case` (e.g., `added-frontend-and-auth-pages`)
- Use `.gitignore` to avoid committing build, log, and environment files

## .gitignore Highlights
- `node_modules/`, `build/`, `.env*` in `frontend/`
- `target/`, `build/` in `server/`
- IDE/project files (`.idea/`, `.vscode/`, etc.)
