import { useState, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';
import type { Book, BookFormData } from '../types';

const CATEGORY_OPTIONS = [
  'Activity Books',
  'Chapter Books',
  'Early Readers',
  'Educational',
  'Middle Grade',
  'Picture Books',
];

interface Props {
  book?: Book | null;
  onSave: (data: BookFormData) => Promise<void>;
  onClose: () => void;
}

const empty: BookFormData = {
  name: '',
  sku: '',
  category: 'Picture Books',
  price: 0,
  quantity: 0,
  description: '',
};

export default function BookModal({ book, onSave, onClose }: Props) {
  const [form, setForm] = useState<BookFormData>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setForm({
        name: book.name,
        sku: book.sku,
        category: book.category,
        price: book.price,
        quantity: book.quantity,
        description: book.description,
      });
    } else {
      setForm(empty);
    }
  }, [book]);

  const set = (field: keyof BookFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.category) {
      setError('Title, ISBN/SKU, and Category are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h2 className="text-lg font-semibold text-orange-900">
              {book ? 'Edit Book' : 'Add New Book'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-100 hover:text-orange-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Title <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
              placeholder="e.g. The Very Hungry Caterpillar"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
            />
          </div>

          {/* ISBN / SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN / SKU <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
              placeholder="e.g. ISBN-978-0399226908"
              value={form.sku}
              onChange={e => set('sku', e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition bg-white"
              value={form.category}
              onChange={e => set('category', e.target.value)}
              required
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Price + Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                placeholder="9.99"
                value={form.price || ''}
                onChange={e => set('price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                placeholder="0"
                value={form.quantity || ''}
                onChange={e => set('quantity', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition resize-none"
              placeholder="Author, age range, synopsis…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 rounded-lg transition-colors shadow-sm"
            >
              <BookOpen size={15} />
              {saving ? 'Saving…' : book ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
