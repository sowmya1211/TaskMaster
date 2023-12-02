# Task Management System - TaskMaster
### A Task Management System React-Go Application 

This task management system application has been developed to handle user authentication, authorization and access control
It was built using Golang for backend and React.js for frontend

## Table of Contents

- [Features](#features)
- [Installation](#installation)

## Features

- Versatile task management system that secures user registration and authentication
- Full Stack development application
  - Backend: Developed using Golang (Server)
  - Database used: MySQL
  - Frontend: React.js with TailwindCSS (Client)
- Key Features of TaskMaster
  - Secure User Registration and Authentication
    - JWT Token was used to secure and authenticate users. 
    - The JWT Token was generated in the server side and passed to the client, where it was stored in a cookie
    - Sensitive information from database was modified / retrieved by authenticating user through the token in the cookie
  - Protection of data against vulnerabilities
    - Hashing has been done to secure sensitive information from attacks in the database
  - Account Deactivation and Deletion
     - Users can deactivate their accounts securely by taking all the dependencies into consideration
  - Hierarchical - User Access Management 
     - Users are given certain user/group roles and they have different sets of permissions and abilities in different groups
     - Custom roles can also be created
     - Users in the system are organized

## Installation

The repository, as of now, does not have a containerized application
The project folder has two directories - client (react app) and server (go app)
### To install react app - client directory
- Go to directory where you want to create react application and install dependencies
```bash
git clone https://github.com/sowmya1211/TaskMaster.git
cd client
npm install
```
- Run the application (localhost:3000 server)
```bash
  npm install
```
### To install go app - server directory
- Go to directory where you want to store the go application and initialize the project
```bash
go mod init server
```
- Add modules required
```bash
go get github.com/gorilla/mux
go get github.com/go-sql-driver/mysql
```
- Run the backend app / server
```bash
go run main.go
```
