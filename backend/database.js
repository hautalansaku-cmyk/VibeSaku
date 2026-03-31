const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'inventory.json');

const SEED_PRODUCTS = [
  { name: 'The Very Hungry Caterpillar', category: 'Picture Books', sku: 'ISBN-9780399226908', price: 8.99, quantity: 54, description: 'Eric Carle · Ages 2–5 · Hardcover · A beloved classic about a caterpillar\'s journey' },
  { name: 'Where the Wild Things Are', category: 'Picture Books', sku: 'ISBN-9780064431781', price: 9.99, quantity: 38, description: 'Maurice Sendak · Ages 4–8 · Hardcover · A timeless adventure into imagination' },
  { name: 'Goodnight Moon', category: 'Board Books', sku: 'ISBN-9780064430173', price: 7.99, quantity: 72, description: 'Margaret Wise Brown · Ages 0–3 · Board Book · Classic bedtime story for babies' },
  { name: 'Green Eggs and Ham', category: 'Early Readers', sku: 'ISBN-9780394800165', price: 10.99, quantity: 61, description: 'Dr. Seuss · Ages 3–7 · Hardcover · A fun rhyming story about trying new things' },
  { name: 'Charlotte\'s Web', category: 'Middle Grade', sku: 'ISBN-9780064400558', price: 8.99, quantity: 29, description: 'E.B. White · Ages 8–12 · Paperback · A heartwarming story of friendship and loyalty' },
  { name: 'The Lion, the Witch and the Wardrobe', category: 'Middle Grade', sku: 'ISBN-9780064404990', price: 9.99, quantity: 22, description: 'C.S. Lewis · Ages 8–12 · Paperback · Epic fantasy adventure in the land of Narnia' },
  { name: 'Harry Potter and the Philosopher\'s Stone', category: 'Young Adult', sku: 'ISBN-9781408855652', price: 12.99, quantity: 45, description: 'J.K. Rowling · Ages 9–12 · Paperback · The magical beginning of the Harry Potter series' },
  { name: 'The Gruffalo', category: 'Picture Books', sku: 'ISBN-9780333710937', price: 8.49, quantity: 41, description: 'Julia Donaldson · Ages 3–6 · Hardcover · A clever mouse outsmarts a hungry gruffalo' },
  { name: 'Matilda', category: 'Middle Grade', sku: 'ISBN-9780142410370', price: 8.99, quantity: 33, description: 'Roald Dahl · Ages 8–11 · Paperback · The story of a remarkable girl with magical powers' },
  { name: 'The Cat in the Hat', category: 'Early Readers', sku: 'ISBN-9780394800011', price: 9.99, quantity: 58, description: 'Dr. Seuss · Ages 4–8 · Hardcover · A mischievous cat brings chaos and fun on a rainy day' },
  { name: 'Diary of a Wimpy Kid', category: 'Middle Grade', sku: 'ISBN-9780810993136', price: 10.99, quantity: 47, description: 'Jeff Kinney · Ages 8–12 · Hardcover · The hilarious illustrated diary of Greg Heffley' },
  { name: 'The Giving Tree', category: 'Picture Books', sku: 'ISBN-9780060256654', price: 8.99, quantity: 35, description: 'Shel Silverstein · Ages 4–8 · Hardcover · A touching tale of unconditional love and generosity' },
  { name: 'Oh, the Places You\'ll Go!', category: 'Picture Books', sku: 'ISBN-9780679805274', price: 11.99, quantity: 27, description: 'Dr. Seuss · Ages 4–8 · Hardcover · An inspiring journey through life\'s ups and downs' },
  { name: 'The Hunger Games', category: 'Young Adult', sku: 'ISBN-9780439023481', price: 11.99, quantity: 39, description: 'Suzanne Collins · Ages 12+ · Paperback · A gripping dystopian survival story' },
  { name: 'Percy Jackson: The Lightning Thief', category: 'Young Adult', sku: 'ISBN-9780786838653', price: 10.99, quantity: 44, description: 'Rick Riordan · Ages 9–12 · Paperback · A modern twist on Greek mythology' },
  { name: 'Brown Bear, Brown Bear', category: 'Board Books', sku: 'ISBN-9780805002010', price: 6.99, quantity: 83, description: 'Bill Martin Jr. · Ages 0–3 · Board Book · Colourful animal patterns for toddlers' },
  { name: 'My First ABC', category: 'Activity Books', sku: 'ISBN-9780789490926', price: 7.99, quantity: 66, description: 'DK · Ages 1–4 · Board Book · Interactive alphabet learning with bright illustrations' },
  { name: 'The Secret Garden', category: 'Middle Grade', sku: 'ISBN-9780064401883', price: 7.99, quantity: 8, description: 'Frances Hodgson Burnett · Ages 8–12 · Paperback · A magical garden transforms a lonely girl' },
  { name: 'Number the Stars', category: 'Young Adult', sku: 'ISBN-9780440227534', price: 8.49, quantity: 17, description: 'Lois Lowry · Ages 10–14 · Paperback · A courageous story set in WWII Denmark' },
  { name: 'Sticker Activity Book: Animals', category: 'Activity Books', sku: 'ISBN-9781780554556', price: 5.99, quantity: 91, description: 'Usborne · Ages 3–6 · Paperback · Over 250 stickers with fun animal activities' }
];

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    const now = new Date().toISOString();
    const data = {
      products: SEED_PRODUCTS.map((p, i) => ({
        id: i + 1,
        ...p,
        created_at: now,
        updated_at: now
      })),
      nextId: SEED_PRODUCTS.length + 1
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log('Database initialized with 20 children\'s books');
    return data;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { loadDB, saveDB };
