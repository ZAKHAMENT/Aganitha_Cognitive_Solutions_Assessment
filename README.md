# Pastebin-Lite

A lightweight Pastebin-like application for creating, sharing, and viewing text pastes. Supports optional **TTL (time-to-live)** and **max view constraints**.  

---

## Features

- Created a paste containing arbitrary text.  
- Receive a shareable URL for each paste.  
- View pastes via a web page or API.  
- Optional constraints:
  - **TTL** (time-based expiry in seconds)  
  - **Max views** (number of allowed views)  
- Safe HTML rendering (prevents script execution)

## Tech Stack

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)  
- **Deployment:** Frontend on Vercel, Backend on Render  

---

## API Endpoints

- GET /api/healthz → Health check
- POST /api/pastes → Create paste
- GET /api/pastes/:id → Fetch paste (JSON)
- GET /p/:id → View paste (HTML)

--- 

## Instruction for Client Side

- cd frontend/my-project
- npm install
- npm run dev

- Environment Variable
  VITE_API_BASE_URL=<your-string>

## Instruction for Server Side

- cd backend
- npm install
- npm start
  
- Environment Variables
  MONGO_URL=<your-connection-string>
  TEST_MODE=1
  PORT=3001
