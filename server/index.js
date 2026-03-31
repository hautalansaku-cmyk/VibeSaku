const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// --- JSON file DB helpers ---
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    return { products: [], nextId: 1 };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Seed database on first run
if (!fs.existsSync(DB_PATH)) {
  const now = new Date().toISOString();
  const seed = {
    nextId: 21,
    products: [
      { id: 1,  name: 'Wireless Bluetooth Headphones', sku: 'ELEC-001', category: 'Electronics',        price: 79.99,  quantity: 45,  description: 'Premium sound quality with active noise cancellation', created_at: now, updated_at: now },
      { id: 2,  name: 'Mechanical Keyboard',           sku: 'ELEC-002', category: 'Electronics',        price: 129.99, quantity: 30,  description: 'Tactile switches with RGB backlight',                  created_at: now, updated_at: now },
      { id: 3,  name: 'USB-C Hub 7-in-1',              sku: 'ELEC-003', category: 'Electronics',        price: 49.99,  quantity: 60,  description: 'Multiple ports including HDMI and USB-A',               created_at: now, updated_at: now },
      { id: 4,  name: "Running Shoes - Men's",          sku: 'SHOE-001', category: 'Footwear',           price: 89.99,  quantity: 25,  description: 'Lightweight with cushioned sole for comfort',            created_at: now, updated_at: now },
      { id: 5,  name: 'Yoga Mat',                       sku: 'SPRT-001', category: 'Sports',             price: 34.99,  quantity: 50,  description: 'Non-slip surface, 6mm thickness',                       created_at: now, updated_at: now },
      { id: 6,  name: 'Water Bottle 32oz',              sku: 'SPRT-002', category: 'Sports',             price: 24.99,  quantity: 80,  description: 'Stainless steel, keeps cold 24h',                       created_at: now, updated_at: now },
      { id: 7,  name: 'Coffee Maker 12-Cup',            sku: 'HOME-001', category: 'Home & Kitchen',     price: 59.99,  quantity: 20,  description: 'Programmable with auto-shutoff',                         created_at: now, updated_at: now },
      { id: 8,  name: 'Cast Iron Skillet 10"',          sku: 'HOME-002', category: 'Home & Kitchen',     price: 44.99,  quantity: 35,  description: 'Pre-seasoned, oven safe to 500F',                        created_at: now, updated_at: now },
      { id: 9,  name: 'Bamboo Cutting Board',           sku: 'HOME-003', category: 'Home & Kitchen',     price: 19.99,  quantity: 55,  description: 'Eco-friendly, dishwasher safe',                          created_at: now, updated_at: now },
      { id: 10, name: 'Desk Lamp LED',                  sku: 'HOME-004', category: 'Home & Kitchen',     price: 39.99,  quantity: 40,  description: 'Adjustable brightness and color temperature',             created_at: now, updated_at: now },
      { id: 11, name: 'Backpack 30L',                   sku: 'BAGS-001', category: 'Bags & Luggage',     price: 64.99,  quantity: 28,  description: 'Waterproof with laptop compartment',                      created_at: now, updated_at: now },
      { id: 12, name: 'Leather Wallet',                 sku: 'BAGS-002', category: 'Bags & Luggage',     price: 29.99,  quantity: 70,  description: 'Slim design, RFID blocking',                             created_at: now, updated_at: now },
      { id: 13, name: 'Sunglasses Polarized',           sku: 'ACC-001',  category: 'Accessories',        price: 54.99,  quantity: 42,  description: 'UV400 protection, unisex',                               created_at: now, updated_at: now },
      { id: 14, name: 'Fitness Tracker Band',           sku: 'ELEC-004', category: 'Electronics',        price: 49.99,  quantity: 33,  description: 'Heart rate, sleep tracking, waterproof',                 created_at: now, updated_at: now },
      { id: 15, name: 'Protein Powder 2lbs',            sku: 'HLTH-001', category: 'Health & Nutrition', price: 39.99,  quantity: 65,  description: 'Whey protein, chocolate flavor',                         created_at: now, updated_at: now },
      { id: 16, name: 'Vitamin C 1000mg',               sku: 'HLTH-002', category: 'Health & Nutrition', price: 14.99,  quantity: 120, description: '60 tablets, immune support',                             created_at: now, updated_at: now },
      { id: 17, name: 'Notebook Set 3-Pack',            sku: 'STAT-001', category: 'Stationery',         price: 12.99,  quantity: 90,  description: 'A5 size, dotted pages',                                  created_at: now, updated_at: now },
      { id: 18, name: 'Gel Pen Set 10-Pack',            sku: 'STAT-002', category: 'Stationery',         price: 9.99,   quantity: 100, description: 'Smooth writing, multiple colors',                        created_at: now, updated_at: now },
      { id: 19, name: 'Phone Stand Adjustable',         sku: 'ELEC-005', category: 'Electronics',        price: 16.99,  quantity: 75,  description: 'Universal fit, foldable',                                created_at: now, updated_at: now },
      { id: 20, name: 'Scented Candle Set',             sku: 'HOME-005', category: 'Home & Kitchen',     price: 22.99,  quantity: 48,  description: 'Soy wax, 3 fragrances, 40h burn time',                   created_at: now, updated_at: now },
    ],
  };
  writeDB(seed);
  console.log('Database seeded with 20 products');
}

// GET all products
app.get('/api/products', (req, res) => {
  const { search, category } = req.query;
  let { products } = readDB();

  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.sku.toLowerCase().includes(s) ||
      (p.description && p.description.toLowerCase().includes(s))
    );
  }
  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }
  products.sort((a, b) => a.name.localeCompare(b.name));
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const { products } = readDB();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// GET categories
app.get('/api/categories', (req, res) => {
  const { products } = readDB();
  const categories = [...new Set(products.map(p => p.category))].sort();
  res.json(categories);
});

// POST create product
app.post('/api/products', (req, res) => {
  const { name, sku, category, price, quantity, description } = req.body;

  if (!name || !sku || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDB();
  if (db.products.find(p => p.sku === sku)) {
    return res.status(409).json({ error: 'SKU already exists' });
  }

  const product = {
    id: db.nextId++,
    name,
    sku,
    category,
    price: parseFloat(price),
    quantity: parseInt(quantity),
    description: description || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.products.push(product);
  writeDB(db);
  res.status(201).json(product);
});

// PATCH update product
app.patch('/api/products/:id', (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const { name, sku, category, price, quantity, description } = req.body;

  if (sku && sku !== db.products[idx].sku && db.products.find(p => p.sku === sku)) {
    return res.status(409).json({ error: 'SKU already exists' });
  }

  const product = db.products[idx];
  if (name !== undefined)        product.name = name;
  if (sku !== undefined)         product.sku = sku;
  if (category !== undefined)    product.category = category;
  if (price !== undefined)       product.price = parseFloat(price);
  if (quantity !== undefined)    product.quantity = parseInt(quantity);
  if (description !== undefined) product.description = description;
  product.updated_at = new Date().toISOString();

  writeDB(db);
  res.json(product);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  db.products.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Product deleted successfully' });
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
