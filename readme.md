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



### 4. API ENDPOINTS

## 4.1 Create A Project

- URL: POST /api/projects

- Description: Creates a new project if the provided owner is authenticated and accepted by an admin.

- Request Body:
  
{
  "name": "New Internal Tool",
  "description": "Tool for automating internal workflows",
  "ownername": "john_doe"
}

- Sample Response:
- 
{
  "id": 1,
  "name": "New Internal Tool",
  "description": "Tool for automating internal workflows",
  "ownerUsername": "john_doe"
}

## 4.2 Get All Projects

- URL: GET /api/projects

- Description: Fetches a list of all existing projects.

- Responses:

json
{
  "id": 1,
  "name": "New Internal Tool",
  "description": "Tool for automating internal workflows",
  "ownerUsername": "john_doe"
}

## 4.3  Create a Milestone

- URL: POST /api/milestones

- Description: Creates a new milestone with a name, start date, and end date.

- Request Body:
- 
{
  "name": "Design Phase Completion",
  "startDate": "2025-06-01",
  "endDate": "2025-06-15"
}


- Sample Response:
- 
{
  "id": 1,
  "name": "Design Phase Completion",
  "startDate": "2025-06-01",
  "endDate": "2025-06-15"
}


## 4.4 Get All Milestones

- URL: GET /api/projects

- Description: Fetches a list of all existing projects.

- Responses:

json
[
  {
    "id": 1,
    "name": "Frontend Implementation",
    "startDate": "2025-06-01",
    "endDate": "2025-06-15"
  },
  {
    "id": 2,
    "name": "Backend Implementation",
    "startDate": "2025-07-01",
    "endDate": "2025-08-15"
  }
]

## 4.5  Create a Task

- URL: POST /api/tasks

- Description: Creates a new task.

- Request Body:
- 
{
  "name": "Design Database Schema",
  "description": "Create and finalize the DB schema for the new feature.",
  "projectId": 2,
  "milestoneId": 2,
  "assignedUserIds": [10, 11]
}


- Sample Response:
- 
{
  "id": 3,
  "name": "Design Database Schema",
  "description": "Create and finalize the DB schema for the new feature.",
  "project": {
    "id": 2,
    "name": "Project Apollo",
    "description": "A project to develop next-generation spacecraft.",
    "ownerUsername": "ananthu"
  },
  "status": "TODO",
  "milestone": {
    "id": 2,
    "name": "Backend Implementation",
    "startDate": "2025-07-01",
    "endDate": "2025-08-15"
  },
  "assignedUsers": [
    {
      "id": 11,
      "username": "sachin1",
      "email": "sachin1@example.com",
      "password": "$2a$10$3/Az21mC1ovOQFLO340UK.tAeUEYk6Pk.LGLbguVogr.INw2KD9dW",
      "role": "DEVELOPER",
      "status": "PENDING",
      "enabled": true,
      "authorities": [
        {
          "authority": "ROLE_DEVELOPER"
        }
      ],
      "accountNonExpired": true,
      "accountNonLocked": true,
      "credentialsNonExpired": true
    },
    {
      "id": 10,
      "username": "sachin",
      "email": "sachin@example.com",
      "password": "$2a$10$9ns6hwv0/cqOpgEtJbnkAus58uvQHFPDE0nqVrhQUR4txLHdDMXwi",
      "role": "DEVELOPER",
      "status": "ACCEPTED",
      "enabled": true,
      "authorities": [
        {
          "authority": "ROLE_DEVELOPER"
        }
      ],
      "accountNonExpired": true,
      "accountNonLocked": true,
      "credentialsNonExpired": true
    }
  ]
}

## 4.6 Get All Tasks

- URL: GET /api/tasks

- Description: Fetches a list of all existing tasks.

- Responses:

json
[
  {
    "id": 1,
    "name": "Implement Login Feature",
    "description": "Create login screen and integrate with backend",
    "project": {
      "id": 1,
      "name": "Project Apollo",
      "description": "A project to develop next-generation spacecraft.",
      "ownerUsername": null
    },
    "status": "TODO",
    "milestone": {
      "id": 1,
      "name": "Frontend Implementation",
      "startDate": "2025-06-01",
      "endDate": "2025-06-15"
    },
    "assignedUser": {
      "id": 1,
      "username": "john",
      "email": "john@example.com",
      "password": "$2a$10$lmK3NYbs.5iy7VGPsdONt..WFvqKXQ8OEmMIgMAd5G8FkuWOhX3Pq",
      "role": "DEVELOPER",
      "status": null,
      "enabled": true,
      "credentialsNonExpired": true,
      "accountNonExpired": true,
      "accountNonLocked": true,
      "authorities": [
        {
          "authority": "ROLE_DEVELOPER"
        }
      ]
    }
  },
  {
    "id": 2,
    "name": "Implement register Feature",
    "description": "Create register screen and integrate with backend",
    "project": {
      "id": 2,
      "name": "Project Apollo",
      "description": "A project to develop next-generation spacecraft.",
      "ownerUsername": "ananthu"
    },
    "status": "TODO",
    "milestone": {
      "id": 2,
      "name": "Backend Implementation",
      "startDate": "2025-07-01",
      "endDate": "2025-08-15"
    },
    "assignedUser": {
      "id": 4,
      "username": "bob",
      "email": "bob@example.com",
      "password": "$2a$10$sx8pwvyyRWxLyZlJ57lJZ..iyMv94JpQUPpMczORZQB5nYUoy1TWq",
      "role": "DEVELOPER",
      "status": null,
      "enabled": true,
      "credentialsNonExpired": true,
      "accountNonExpired": true,
      "accountNonLocked": true,
      "authorities": [
        {
          "authority": "ROLE_DEVELOPER"
        }
      ]
    }
  }
]

