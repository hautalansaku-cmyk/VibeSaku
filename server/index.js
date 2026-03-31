const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

function readDB() {
  if (!fs.existsSync(DB_PATH)) return { products: [], nextId: 1 };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Seed database with 20 children's books on first run
if (!fs.existsSync(DB_PATH)) {
  const now = new Date().toISOString();
  const seed = {
    nextId: 21,
    products: [
      { id: 1,  name: 'The Very Hungry Caterpillar',     sku: 'ISBN-978-0399226908', category: 'Picture Books',   price: 8.99,  quantity: 85,  description: 'By Eric Carle. Ages 2-5. A classic story of transformation through colorful collage art.', created_at: now, updated_at: now },
      { id: 2,  name: 'Goodnight Moon',                  sku: 'ISBN-978-0694003617', category: 'Picture Books',   price: 7.99,  quantity: 72,  description: 'By Margaret Wise Brown. Ages 0-3. A timeless bedtime ritual in rhyme.', created_at: now, updated_at: now },
      { id: 3,  name: 'Where the Wild Things Are',       sku: 'ISBN-978-0064431781', category: 'Picture Books',   price: 9.99,  quantity: 60,  description: 'By Maurice Sendak. Ages 4-8. An imaginative tale of adventure and homecoming.', created_at: now, updated_at: now },
      { id: 4,  name: "Oh, the Places You'll Go!",       sku: 'ISBN-978-0679805274', category: 'Picture Books',   price: 11.99, quantity: 95,  description: 'By Dr. Seuss. Ages 4-8. An inspiring journey through life\'s ups and downs.', created_at: now, updated_at: now },
      { id: 5,  name: 'The Cat in the Hat',              sku: 'ISBN-978-0394800011', category: 'Early Readers',   price: 9.99,  quantity: 110, description: 'By Dr. Seuss. Ages 5-8. A rainy day adventure with the mischievous Cat.', created_at: now, updated_at: now },
      { id: 6,  name: 'Green Eggs and Ham',              sku: 'ISBN-978-0394800168', category: 'Early Readers',   price: 8.99,  quantity: 98,  description: 'By Dr. Seuss. Ages 4-8. An adventure in trying new things.', created_at: now, updated_at: now },
      { id: 7,  name: 'Frog and Toad Are Friends',       sku: 'ISBN-978-0064440202', category: 'Early Readers',   price: 6.99,  quantity: 55,  description: 'By Arnold Lobel. Ages 5-8. Five heartwarming tales of friendship.', created_at: now, updated_at: now },
      { id: 8,  name: 'Magic Tree House: Dinosaurs',     sku: 'ISBN-978-0679824114', category: 'Chapter Books',   price: 5.99,  quantity: 48,  description: 'By Mary Pope Osborne. Ages 6-10. Jack and Annie travel back to the time of dinosaurs.', created_at: now, updated_at: now },
      { id: 9,  name: 'Charlotte\'s Web',                sku: 'ISBN-978-0064400558', category: 'Chapter Books',   price: 8.99,  quantity: 65,  description: 'By E.B. White. Ages 8-12. A beloved story of friendship between a pig and a spider.', created_at: now, updated_at: now },
      { id: 10, name: 'The BFG',                         sku: 'ISBN-978-0142410381', category: 'Chapter Books',   price: 8.99,  quantity: 52,  description: 'By Roald Dahl. Ages 8-12. Sophie and the Big Friendly Giant share a magical adventure.', created_at: now, updated_at: now },
      { id: 11, name: 'Harry Potter and the Sorcerer\'s Stone', sku: 'ISBN-978-0590353427', category: 'Middle Grade', price: 12.99, quantity: 120, description: 'By J.K. Rowling. Ages 9-12. A young wizard discovers his magical heritage.', created_at: now, updated_at: now },
      { id: 12, name: 'The Lion, the Witch and the Wardrobe', sku: 'ISBN-978-0064404990', category: 'Middle Grade', price: 9.99, quantity: 75,  description: 'By C.S. Lewis. Ages 8-12. Four children discover the magical land of Narnia.', created_at: now, updated_at: now },
      { id: 13, name: 'A Wrinkle in Time',               sku: 'ISBN-978-0312367541', category: 'Middle Grade',    price: 8.99,  quantity: 43,  description: 'By Madeleine L\'Engle. Ages 9-12. Meg Murry searches for her missing father across time.', created_at: now, updated_at: now },
      { id: 14, name: 'My First ABC Book',               sku: 'ISBN-978-0789497123', category: 'Educational',     price: 10.99, quantity: 130, description: 'Ages 2-4. Bright illustrations make learning the alphabet fun and engaging.', created_at: now, updated_at: now },
      { id: 15, name: 'National Geographic Kids: Sharks', sku: 'ISBN-978-1426310²16', category: 'Educational',   price: 7.99,  quantity: 67,  description: 'Ages 6-10. Fascinating facts and stunning photos about sharks.', created_at: now, updated_at: now },
      { id: 16, name: 'The Diary of a Wimpy Kid',        sku: 'ISBN-978-0810993136', category: 'Middle Grade',    price: 10.99, quantity: 88,  description: 'By Jeff Kinney. Ages 8-13. A hilarious diary of a middle school student\'s struggles.', created_at: now, updated_at: now },
      { id: 17, name: 'Big Book of Art Activities',      sku: 'ISBN-978-0794541309', category: 'Activity Books',  price: 13.99, quantity: 40,  description: 'Ages 5-10. Over 50 step-by-step drawing, painting, and craft projects.', created_at: now, updated_at: now },
      { id: 18, name: 'My First Sticker Book: Animals',  sku: 'ISBN-978-1409598765', category: 'Activity Books',  price: 6.99,  quantity: 57,  description: 'Ages 3-6. 200+ stickers for hours of creative fun with animal scenes.', created_at: now, updated_at: now },
      { id: 19, name: 'Pete the Cat: I Love My White Shoes', sku: 'ISBN-978-0061906220', category: 'Picture Books', price: 9.99, quantity: 63, description: 'By Eric Litwin. Ages 3-7. Pete shows staying positive no matter what happens.', created_at: now, updated_at: now },
      { id: 20, name: 'Captain Underpants',              sku: 'ISBN-978-0439049962', category: 'Chapter Books',   price: 7.99,  quantity: 77,  description: 'By Dav Pilkey. Ages 7-12. George and Harold\'s outrageous hypnotized principal.', created_at: now, updated_at: now },
    ],
  };
  writeDB(seed);
  console.log('Database seeded with 20 children\'s books');
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
    return res.status(409).json({ error: 'ISBN/SKU already exists' });
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
    return res.status(409).json({ error: 'ISBN/SKU already exists' });
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
  res.json({ message: 'Book deleted successfully' });
});

// Serve static frontend in production
const staticPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
