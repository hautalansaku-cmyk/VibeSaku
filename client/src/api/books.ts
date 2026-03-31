import type { Book, BookFormData } from '../types';

const BASE = '/api';

export async function fetchBooks(search?: string, category?: string): Promise<Book[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category && category !== 'All') params.set('category', category);
  const res = await fetch(`${BASE}/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createBook(data: BookFormData): Promise<Book> {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create book');
  return json;
}

export async function updateBook(id: number, data: Partial<BookFormData>): Promise<Book> {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update book');
  return json;
}

export async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${BASE}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || 'Failed to delete book');
  }
}
