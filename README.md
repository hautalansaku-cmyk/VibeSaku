# Little Pages — Children's Book Inventory

A modern web app for managing the inventory of a children's book store. Browse, add, edit, and remove books, and adjust stock quantities in real time.

![Little Pages screenshot](https://github.com/user-attachments/assets/1f173407-1b05-48b1-803a-f312d5f6ded2)

## Features

- **Browse books** — sortable table with title, category badge, ISBN/SKU, price, and quantity
- **Search** — filter by title, ISBN, or description
- **Category filters** — Activity Books, Chapter Books, Early Readers, Educational, Middle Grade, Picture Books
- **Add / Edit books** — modal form with validation
- **Delete books** — confirmation dialog before removal
- **Adjust quantity** — inline ± stepper with low-stock / out-of-stock indicators
- **Dashboard stats** — total titles, total stock, inventory value, low-stock and out-of-stock counts
- **Pre-seeded database** — 20 children's books loaded automatically on first run

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Lucide icons |
| Backend  | Node.js, Express |
| Database | JSON file (auto-seeded on first run) |

## Getting started

### Prerequisites

- Node.js ≥ 18

### Install dependencies

```bash
# Root (concurrently)
npm install

# Backend
cd server && npm install && cd ..

# Frontend
cd client && npm install && cd ..
```

### Run in development

```bash
npm run dev
```

This starts:
- **Backend** at `http://localhost:3001`
- **Frontend** at `http://localhost:5173` (proxies `/api` to the backend)

### Build for production

```bash
npm run build        # builds the React app into client/dist
cd server && npm start   # serves both API and static files on port 3001
```

## Project structure

```
├── client/          # React + TypeScript frontend (Vite)
│   └── src/
│       ├── api/     # Fetch helpers
│       ├── components/  # BooksTable, BookModal, DeleteDialog, etc.
│       └── types/   # Shared TypeScript types
├── server/
│   ├── index.js     # Express API server
│   └── db.json      # Auto-generated JSON database (gitignored)
└── package.json     # Root scripts using concurrently
```
