# 💺 Flight Booking Microservice

This repository contains the flight ticket booking service, which is part of a larger flight booking system. The entire source code resides within the `src` directory and follows a clean modular structure for scalability and maintainability.

## 📁 Project Structure

- `config` -> This folder has all the configuration like logging config etc

- `routes` -> Routes folder holds all the routes for the project.

- `middlewares` -> This folder has all our middlewares like validator, authenticator etc

- `controllers` -> This where we controll our request and response. It just controlls the request-response cycle all the business logic is done in services folder.

- `repositories` -> The folder contains all the logic using which we interact with DB by writing queries, all the raw queries or ORM queries will go here.

- `services` -> Contains all the business logic and interact with the repositories to get data from the database.

- `utils` -> This folder contains the helper methods, error classess etc for our project.

## 🔐 Environment Configuration

The `.env.example` file serves as a template for required environment variables. Copy it and paste to `.env`, then fill in the actual values.

## 🛠️ Setup Instructions

1. Install Dependencies `npm install`

2. Configure Environment Variables

   Copy the example .env file and update it with your local database credential

3. Create and Migrate Database

   ```
   npx sequelize db:create
   npx sequelize db:migrate
   ```

4. Start Development Server
   `npm run dev`
