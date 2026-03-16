
# Notification Service

## Overview

This project implements a **Notification Service** backend that allows applications to create, deliver, and manage user notifications.

The service supports multiple notification channels and provides APIs to:

- Create notifications
- Deliver notifications through different channels
- List user notifications with pagination
- Retrieve unread notifications
- Mark notifications as read

The system is designed with **clean architecture principles**, separating concerns between API handlers, services, repositories, and DTOs.

---

# Tech Stack

- Runtime / Package Manager: **Bun**
- Framework: **Encore.ts**
- Language: **TypeScript**
- Database: **PostgreSQL**
- Query Builder: **Knex**
- Logging: **Encore built‑in logging**

---

# Architecture

backend
│
├── users
│   ├── dto
│   ├── repository
│   ├── service
│   ├── controller
│   └── presenter
│
├── notifications
│   ├── dto
│   ├── repository
│   ├── service
│   ├── controller
│   └── presenter
│
├── shared
│   ├── db.ts
│   └── constants.ts
│
└── cli

### Layers

API / Controller → HTTP request handling  
Service → Business logic  
Repository → Database access  
DTO → Request / response models  
Presenter / Mapper → Convert DB models to API responses

---

# Features

• Create notifications  
• Deliver notifications through multiple channels  
• List user notifications with pagination  
• Retrieve unread notifications  
• Mark notifications as read

Supported channels:

- in_app
- email

Email delivery includes a **20% simulated failure rate**.

---

# API Endpoints


## Create User

POST /users

Example request:

{
  "name": "Alice",
  "email": "alice@example.com"
}


GET /users?limit=20&page=1


## Create Notification

POST /notifications

Example request:

{
  "userId": "user-id",
  "channel": "email",
  "title": "Welcome",
  "body": "Welcome to the platform"
}

---

## List User Notifications

GET /users/:userId/notifications

Query parameters:

limit  
page

Example:

GET /users/123/notifications?limit=20&page=1

---

## List Unread Notifications

GET /users/:userId/notifications/unread?limit=20&page=1

---

## Mark Notification as Read

PATCH /notifications/:notificationId/read?limit=20&page=1

---

# Database Schema

Users

id  
name  
email  
created_at  

Notifications

id  
user_id  
channel  
title  
body  
delivery_status  
delivery_attempts  
failure_reason  
created_at  
read_at  

---

# Running the Project

## Prerequisites

• Bun  
• Encore CLI
• Docker

Install Encore:

[Encore Installation Guide](https://encore.dev/docs/go/install)

Install Bun:

[Bun Installation Guide](https://bun.com/docs/installation)

---

## Install Dependencies

bun install

---

## Run Service

encore run

---

## CLI (Bun) 

### Install deps

```bash
cd cli
bun install
```

### Build single binary

```bash
cd cli
bun build --compile ./src/cli.ts --outfile notify
```
OR
```bash
cd cli
bun run build:cli
```

### Configure backend URL

- Flag: `--api-url=http://localhost:4000`
- Or .env: `NOTIFY_API_URL=http://localhost:4000`

### Example commands

```bash
Create User: 
./notify users:create --name "Alice" --email "alice@example.com" 

List Users:
./notify users:list 

./notify send --user-id 1 --channel in_app --title "Hello" --body "Welcome!" 

List Notifications:
./notify list --user-id 1 --page 1 --limit 10

List Unread Notifications:
./notify unread --user-id 1 --page 1 --limit 10

Mark as Read:
./notify read --id 1
```
---

# Design Decisions

### Bun as Runtime and Package Manager
Bun was chosen because the assignment explicitly recommended it and it provides fast dependency installation and execution. Since the service itself runs through Encore, Bun mainly improves the development workflow rather than affecting runtime architecture.

### Knex Query Builder
Knex was used instead of an ORM to keep database access explicit while avoiding raw SQL strings throughout the codebase. This provides type safety and flexibility without introducing the additional abstraction and complexity of a full ORM.

### Repository Pattern
Database access is isolated in repositories to separate persistence logic from business logic. This improves maintainability and allows services to be tested independently from the database layer.

### Simulated Email Delivery
Instead of integrating with an external email provider, email delivery is simulated with a random success/failure rate. This keeps the scope aligned with the assignment while still demonstrating how delivery status and failure handling would work in a real system.

### No Background Workers
The assignment scope did not require asynchronous processing or retries. In a production environment, notification delivery would typically be handled through a queue and worker system (e.g., Kafka, RabbitMQ, or a job queue) to support retries and improve scalability.

---

# Future Improvements

• Retry mechanism for failed notifications  
• Background job workers / queues  
• Email provider integration  
• Notification preferences  
• Authentication & authorization  
• Rate limiting
• Real‑time delivery

