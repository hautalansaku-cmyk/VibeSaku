import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, BookOpen, RefreshCw } from 'lucide-react';
import type { Book, BookFormData } from './types';
import { fetchBooks, fetchCategories, createBook, updateBook, deleteBook } from './api/books';
import BooksTable from './components/BooksTable';
import BookModal from './components/BookModal';
import DeleteDialog from './components/DeleteDialog';
import StatsBar from './components/StatsBar';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteBook_, setDeleteBook] = useState<Book | null>(null);

  const load = useCallback(async (q?: string, cat?: string) => {
    setLoading(true);
    setError('');
    try {
      const [data, cats] = await Promise.all([
        fetchBooks(q, cat),
        fetchCategories(),
      ]);
      setBooks(data);
      setCategories(cats);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all books once for stats
  const loadAll = useCallback(async () => {
    try {
      const all = await fetchBooks();
      setAllBooks(all);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    load(search, activeCategory);
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    load(value, activeCategory);
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    load(search, cat);
  };

  const handleAdd = async (data: BookFormData) => {
    await createBook(data);
    await Promise.all([load(search, activeCategory), loadAll()]);
  };

  const handleEdit = async (data: BookFormData) => {
    if (!editBook) return;
    await updateBook(editBook.id, data);
    await Promise.all([load(search, activeCategory), loadAll()]);
  };

  const handleDelete = async () => {
    if (!deleteBook_) return;
    await deleteBook(deleteBook_.id);
    await Promise.all([load(search, activeCategory), loadAll()]);
  };

  const handleQuantity = async (book: Book, qty: number) => {
    await updateBook(book.id, { quantity: qty });
    await Promise.all([load(search, activeCategory), loadAll()]);
  };

  const allCategories = ['All', ...categories];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">Little Pages</h1>
              <p className="text-xs text-orange-500 font-medium">Children's Book Inventory</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Book</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <StatsBar books={allBooks.length > 0 ? allBooks : books} />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition shadow-sm"
              placeholder="Search by title, ISBN, or description…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={() => load(search, activeCategory)}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-orange-500 hover:border-orange-300 transition-colors shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-orange-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              {loading ? 'Loading…' : `${books.length} book${books.length !== 1 ? 's' : ''}`}
              {activeCategory !== 'All' && (
                <span className="ml-2 text-orange-500">· {activeCategory}</span>
              )}
            </h2>
          </div>
          <BooksTable
            books={books}
            loading={loading}
            onEdit={b => setEditBook(b)}
            onDelete={b => setDeleteBook(b)}
            onQuantityChange={handleQuantity}
          />
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <BookModal
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editBook && (
        <BookModal
          book={editBook}
          onSave={handleEdit}
          onClose={() => setEditBook(null)}
        />
      )}

      {deleteBook_ && (
        <DeleteDialog
          book={deleteBook_}
          onConfirm={handleDelete}
          onClose={() => setDeleteBook(null)}
        />
      )}
    </div>
  );
}
