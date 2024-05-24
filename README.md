# MINIMAL TODOIST CLONE

This is a minimal clone of Todoist buitl with:
### Frontent
- React
- Radix UI
- Tailwind CSS
- React Hook Form

### Backend
- Node.js
- Express
- Prisma
- PostgreSQL
- Redis (session auth)

### Testing
- Jest for backend API e2e testing

# How to Setup and Run on Local Machine

### Prerequisites
- Node.js 21 or higher recommended
- Docker and Docker Compose
- Yarn

### Backend Setup
1. Go to todos-backend folder and create a `.env` file with the following content:
```
DATABASE_URL=postgres://postgres:password@localhost:5432/todos
REDIS_URL=redis://localhost:6379
SESSION_SECRET=XYZ
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000
```
2. Run `docker compose up` to start the PostgreSQL and Redis containers
3. Run `yarn install` to install the dependencies
4. Run `yarn prisma db push` to create the database and tables
5. Run `yarn dev` to start the backend server

(Optional) To run the tests, run `yarn test` before starting the server

### Frontend Setup
1. Go to todos-frontend folder and run `yarn install` to install the dependencies
2. Run `yarn start` to start the frontend server

# Features
- Create tasks with due date generated with NLP
- Update, Reorder, and Delete tasks
- Due Date and Time Picker

# Also Read

For the frontend I did a lot of new things like using Radix UI for the first time, but along the way I decided to add tailwindcss as well to add minor stylings without creating a css selector for each element. This saved me a lot of time and let me focus on the functionality of the app.

One of the challenging parts were the NLP for the due date and time. I used the `chrono-node` library to parse the due date and time from the task description. It was a bit challenging to get the correct date and time format from the library but I was able to get it working. I also used date-fns for formating date time referencing from current time.