const express = require('express');
const cors = require('cors');
const { loadDB, saveDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all products (with optional search & category filter)
app.get('/api/products', (req, res) => {
  const db = loadDB();
  const { search, category } = req.query;
  let products = db.products;

  if (search) {
    const term = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
    );
  }
  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }

  products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  res.json(products);
});

// GET categories
app.get('/api/categories', (req, res) => {
  const db = loadDB();
  const categories = [...new Set(db.products.map(p => p.category))].sort();
  res.json(categories);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const db = loadDB();
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product
app.post('/api/products', (req, res) => {
  const { name, category, sku, price, quantity, description } = req.body;

  if (!name || !category || !sku || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, category, sku, price, quantity' });
  }

  const db = loadDB();

  if (db.products.some(p => p.sku === sku)) {
    return res.status(409).json({ error: 'SKU already exists' });
  }

  const now = new Date().toISOString();
  const product = {
    id: db.nextId++,
    name,
    category,
    sku,
    price: parseFloat(price),
    quantity: parseInt(quantity),
    description: description || '',
    created_at: now,
    updated_at: now
  };

  db.products.push(product);
  saveDB(db);
  res.status(201).json(product);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const db = loadDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const { name, category, sku, price, quantity, description } = req.body;
  const existing = db.products[idx];

  if (sku && sku !== existing.sku && db.products.some(p => p.sku === sku)) {
    return res.status(409).json({ error: 'SKU already exists' });
  }

  db.products[idx] = {
    ...existing,
    name: name ?? existing.name,
    category: category ?? existing.category,
    sku: sku ?? existing.sku,
    price: price !== undefined ? parseFloat(price) : existing.price,
    quantity: quantity !== undefined ? parseInt(quantity) : existing.quantity,
    description: description !== undefined ? description : existing.description,
    updated_at: new Date().toISOString()
  };

  saveDB(db);
  res.json(db.products[idx]);
});

// PATCH update quantity only
app.patch('/api/products/:id/quantity', (req, res) => {
  const { quantity } = req.body;
  if (quantity === undefined || isNaN(parseInt(quantity))) {
    return res.status(400).json({ error: 'quantity is required' });
  }
  if (parseInt(quantity) < 0) {
    return res.status(400).json({ error: 'quantity cannot be negative' });
  }

  const db = loadDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  db.products[idx].quantity = parseInt(quantity);
  db.products[idx].updated_at = new Date().toISOString();
  saveDB(db);
  res.json(db.products[idx]);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const db = loadDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  db.products.splice(idx, 1);
  saveDB(db);
  res.status(204).send();
});

// GET stats
app.get('/api/stats', (req, res) => {
  const db = loadDB();
  const products = db.products;
  res.json({
    total_products: products.length,
    total_items: products.reduce((s, p) => s + p.quantity, 0),
    total_value: products.reduce((s, p) => s + p.price * p.quantity, 0),
    out_of_stock: products.filter(p => p.quantity === 0).length,
    low_stock: products.filter(p => p.quantity > 0 && p.quantity <= 10).length
  });
});

app.listen(PORT, () => {
  console.log(`Inventory API running on http://localhost:${PORT}`);
});
