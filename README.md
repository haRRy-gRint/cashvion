# Personal Expense Analyzer

A full-stack application for recording and analyzing personal expenses, featuring public and private transaction visibility.

## 🚀 Features

- **Transaction Logging**: Record amount, category, date, description.
- **Privacy Controls**: Toggle visibility between **Public** and **Private**.
- **Filtered Views**: View transactions based on their visibility status.
- **Secure Backend**: Input validation, parameterized queries, and error handling.
- **Modern UI**: Clean, responsive, and functional interface.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Vanilla CSS (Custom Design System)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)

### 1. Database Setup
Ensure PostgreSQL is running on your machine.
Create a database (default: `expense_tracker`).
The application connects using default credentials (`postgres`/`password`). Update `server/.env` if different.

To initialize the table schema:
```bash
node server/init_db.js
```

### 2. Backend Setup
```bash
cd server
npm install
npm start
```
Server runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

## 📦 Deployment

### Frontend (Vercel)
The `client` folder is ready to be deployed to Vercel. Ensure the build command is set to `npm run build` and output directory to `dist`.

### Backend
The `server` folder is ready for Node.js hosting. Ensure environment variables are set in the production environment.
