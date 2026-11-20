# Roxiler Store Rating System

A full-stack web application that allows users to rate registered stores. The application supports three roles: System Administrator, Normal User, and Store Owner.

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- bcryptjs

### Database
- MySQL

## Features

### System Administrator
- View dashboard statistics.
- Manage users and stores.
- Create administrators, normal users, and store owners.
- View user and store details.
- Filter and manage listings.
- View store ratings.

### Normal User
- Register and log in.
- Browse registered stores.
- Search stores by name and address.
- Submit ratings from 1 to 5.
- Update previously submitted ratings.
- Update password.

### Store Owner
- Log in to the platform.
- View store rating statistics.
- View users who submitted ratings for their store.
- Update password.

## Project Structure

roxiler-rating-system/
├── client/          # React frontend
├── server/          # Express backend
├── api-test.http    # API testing requests
└── README.md

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MySQL Server
- Git

## Installation and Setup

### 1. Clone the repository

git clone https://github.com/pavanshetty09/roxiler-store-rating-system-Copy.git

cd roxiler-store-rating-system-Copy

### 2. Configure the database

Create a MySQL database:

CREATE DATABASE roxiler_rating_system;

### 3. Configure the backend

Open the server directory:

cd server

Install dependencies:

npm install

Copy the example environment file:

Windows PowerShell:

Copy-Item .env.example .env

Update server/.env with your actual MySQL credentials and configuration.

Required backend environment variables:

- PORT
- DATABASE_URL
- JWT_SECRET
- ADMIN_NAME
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_ADDRESS

### 4. Set up Prisma

Run these commands from the server directory:

npx prisma generate

npx prisma migrate deploy

### 5. Create the administrator account

Run:

npm run seed:admin

The administrator credentials are read from the server environment file.

### 6. Start the backend

Run:

npm run dev

The backend runs at:

http://localhost:5000

API health check:

http://localhost:5000/

Database health check:

http://localhost:5000/api/health/db

### 7. Configure the frontend

Open another terminal and navigate to the client directory:

cd client

Install dependencies:

npm install

Copy the frontend environment example:

Copy-Item .env.example .env

The default frontend API URL is:

VITE_API_URL=http://localhost:5000

### 8. Start the frontend

Run:

npm run dev

Open the local URL displayed by Vite in your browser.

## Demo Accounts

The administrator account is created using the environment variables configured in server/.env.

Normal users can register through the signup page.

A Store Owner account can be created through the administrator interface.

For evaluation, configure and provide dedicated demo login credentials for all three roles.

## Validation Rules

- Name: 20 to 60 characters.
- Address: Maximum 400 characters.
- Password: 8 to 16 characters, including at least one uppercase letter and one special character.
- Email: Must be a valid email address.
- Ratings: Integer values from 1 to 5.

## Security

- Passwords are hashed using bcryptjs.
- Authentication uses JWT.
- Role-based access control protects restricted routes.
- Environment variables are used for sensitive configuration.
- Actual environment files and secrets must not be committed.

## Author

Developed as a Full Stack Intern Coding Challenge project.
