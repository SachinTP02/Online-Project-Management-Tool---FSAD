# 🧑‍💻 Online Project Management System

This is a web-based enterprise project management system 

---

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL Server running locally

---

## Database Setup

### Run the following SQL in your MySQL client (e.g., DataGrip, MySQL CLI):
```sql
CREATE DATABASE opm_db;
CREATE USER 'opm_user'@'localhost' IDENTIFIED BY 'opm_pass';
GRANT ALL PRIVILEGES ON opm_db.* TO 'opm_user'@'localhost';
FLUSH PRIVILEGES;
```
## Running the Application

step1: Build the project using Maven
    mvn clean install
step2: Run the application using Maven
    mvn spring-boot:run
