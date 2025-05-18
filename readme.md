# Online Project Management Tool

A full-stack project management application with a Spring Boot backend and a React frontend. This tool allows users to register, log in, and manage projects, tasks, milestones, and reports efficiently.

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

## MySQL Setup

1. **Install MySQL:**
   - [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
   - Follow the installer instructions for your OS (Windows, macOS, Linux)

2. **Start MySQL Server:**
   - On macOS: `brew services start mysql` (if installed via Homebrew)
   - On Windows: Use MySQL Workbench or Services app
   - On Linux: `sudo service mysql start`

3. **Create the database and user:**
   - Open a terminal and run:
     ```sh
     mysql -u root -p
     ```
   - Enter your MySQL root password.
   - Then run the following commands:
     ```sql
     CREATE DATABASE opm_db;
     CREATE USER 'opm_user'@'localhost' IDENTIFIED BY 'opm_pass';
     GRANT ALL PRIVILEGES ON opm_db.* TO 'opm_user'@'localhost';
     FLUSH PRIVILEGES;
     EXIT;
     ```

4. **Update credentials if needed:**
   - If you change the database name, username, or password, update them in `server/src/main/resources/application.properties`.

## Setup & Run

### 1. Clone the repository and switch to main branch
```sh
git clone <your-repo-url>
cd Online-Project-Management-Tool---FSAD
git checkout main
```

### 2. Backend (Spring Boot)
- Ensure MySQL is running and the database/user are set up as above
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

## Notes
- CORS is enabled for the React frontend (`http://localhost:3000`).
