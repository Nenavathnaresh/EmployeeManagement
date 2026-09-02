# Employee Management System

A full-stack Employee Management System built using Angular for the frontend and Java Spring Boot for the backend.

The application provides functionality for managing employee information through a web-based interface.

## Tech Stack
## Frontend
Angular
TypeScript
HTML5
CSS3
Angular HTTP Client
RxJS
## Backend
Java
Spring Boot
Spring Web
Spring Data JPA
Hibernate
REST APIs
## Database
Postgresql
## Tools
Git
GitHub
Maven
npm
Visual Studio Code / IntelliJ IDEA
## Project Structure
employee-management/
│
├── frontend/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── .gitignore
└── README.md

## Features
Add new employees
View employee details
Update employee information
Delete employees
Display employee list
REST API integration between Angular and Spring Boot
Database persistence using Spring Data JPA
Responsive frontend interface
## Prerequisites

Before running the application, make sure you have installed:

Java JDK
Node.js
npm
Angular CLI
Maven
MySQL
Git
## Getting Started
## 1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/employee-management.git


Navigate into the project:

cd employee-management

## Backend Setup

Navigate to the backend:

cd backend


Configure your database connection in your Spring Boot configuration.

For example:

spring.datasource.url=jdbc:mysql://localhost:3306/employee_management
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

Run the Spring Boot application using Maven:

mvn spring-boot:run


The backend will normally start at:

http://localhost:8080

## Frontend Setup

Open another terminal and navigate to the frontend:

cd frontend


Install dependencies:

npm install


Start the Angular development server:

ng serve


The frontend will normally be available at:

http://localhost:4200

## API Communication

The Angular frontend communicates with the Spring Boot backend through REST APIs.

Example:

Angular Frontend
       |
       | HTTP Requests
       ↓
Spring Boot REST API
       |
       ↓
Spring Data JPA
       |
       ↓
MySQL Database
