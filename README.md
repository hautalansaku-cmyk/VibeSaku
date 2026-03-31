# 📚 Little Reads — Children's Book Inventory Manager

A modern web app for managing the inventory of a children's book retail store.

## Features

- 📖 **Browse** all book titles with live search and category filters
- ➕ **Add** new books with title, category, ISBN/SKU, price, copies and description
- ✏️ **Edit** any book's details
- 🔢 **Adjust copies** in-stock with + / − buttons or by clicking the number to type
- 🗑️ **Remove** books from the inventory
- 📊 **Dashboard stats** — total titles, total copies, inventory value, low stock and out-of-stock counts

## Pre-loaded catalogue

20 popular children's books across six categories:
- Picture Books · Board Books · Early Readers · Middle Grade · Young Adult · Activity Books

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | JSON file (auto-seeded on first run) |

## Getting started

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Terminal 1 — API server (port 3001)
cd backend && npm start

# Terminal 2 — Dev server (port 5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.
