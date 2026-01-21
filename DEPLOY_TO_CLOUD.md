# Deployment Guide for Expense-Lens

You can now deploy your application to the cloud! This will allow you to stop running the servers on your own computer.

## Prerequisites
- A **GitHub Account**.
- A **Render.com Account** (Free tier is great).
- A **Vercel Account** (Free tier is great).

---

## Part 1: Push Code to GitHub
1.  Initialize a git repository if you haven't:
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    ```
2.  Create a new repository on GitHub (e.g., `expense-lens`).
3.  Push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/expense-lens.git
    git push -u origin main
    ```

---

## Part 2: Backend (Render.com)
1.  Login to [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository (`expense-lens`).
4.  **Settings**:
    - **Root Directory**: `server` (Important!)
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js` (or `node index.js`, check `server/package.json`)
5.  **Environment Variables**:
    - Add `DATABASE_URL` -> (Copy from your local `.env`)
    - Add `JWT_SECRET` -> (Any secret string)
6.  Click **Deploy Web Service**.
7.  Copy your new **Backend URL** (e.g., `https://expense-lens-api.onrender.com`).

---

## Part 3: Frontend (Vercel)
1.  Login to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository (`expense-lens`).
4.  **Settings**:
    - **Framework Preset**: Vite
    - **Root Directory**: `client` (Important! Click "Edit" next to "Root Directory" and select `client`).
5.  **Environment Variables**:
    - Add `VITE_API_URL` -> `https://expense-lens-api.onrender.com` (Your Render Backend URL from Part 2).
6.  Click **Deploy**.

---

## ✅ Done!
Your app is now fully cloud-hosted. You can close your local terminals and access the Vercel URL on any device!
