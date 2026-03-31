import { useState } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Book } from '../types';
import QuantityControl from './QuantityControl';

type SortKey = 'name' | 'category' | 'price' | 'quantity';

const CATEGORY_COLORS: Record<string, string> = {
  'Picture Books':  'bg-pink-100 text-pink-700 border-pink-200',
  'Early Readers':  'bg-sky-100 text-sky-700 border-sky-200',
  'Chapter Books':  'bg-violet-100 text-violet-700 border-violet-200',
  'Middle Grade':   'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Educational':    'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Activity Books': 'bg-amber-100 text-amber-700 border-amber-200',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-gray-100 text-gray-700 border-gray-200';
}

interface Props {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onQuantityChange: (book: Book, qty: number) => Promise<void>;
  loading: boolean;
}

export default function BooksTable({ books, onEdit, onDelete, onQuantityChange, loading }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [updating, setUpdating] = useState<number | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...books].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
    else if (sortKey === 'price') cmp = a.price - b.price;
    else if (sortKey === 'quantity') cmp = a.quantity - b.quantity;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={14} className="inline ml-0.5" /> : <ChevronDown size={14} className="inline ml-0.5" />
    ) : (
      <ChevronUp size={14} className="inline ml-0.5 opacity-20" />
    );

  const handleQuantity = async (book: Book, qty: number) => {
    setUpdating(book.id);
    try { await onQuantityChange(book, qty); }
    finally { setUpdating(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <span className="text-4xl animate-bounce">📚</span>
          <p className="text-sm">Loading books…</p>
        </div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <span className="text-5xl">🔍</span>
          <p className="font-medium text-gray-500">No books found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  const th = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider select-none';

  return (
    <div className="overflow-x-auto rounded-xl border border-orange-100">
      <table className="w-full text-sm">
        <thead className="bg-orange-50">
          <tr>
            <th className={`${th} cursor-pointer hover:text-orange-700`} onClick={() => handleSort('name')}>
              Title <SortIcon k="name" />
            </th>
            <th className={`${th} cursor-pointer hover:text-orange-700`} onClick={() => handleSort('category')}>
              Category <SortIcon k="category" />
            </th>
            <th className={`${th} hidden md:table-cell`}>ISBN / SKU</th>
            <th className={`${th} cursor-pointer hover:text-orange-700`} onClick={() => handleSort('price')}>
              Price <SortIcon k="price" />
            </th>
            <th className={`${th} cursor-pointer hover:text-orange-700`} onClick={() => handleSort('quantity')}>
              Quantity <SortIcon k="quantity" />
            </th>
            <th className={`${th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-50 bg-white">
          {sorted.map(book => (
            <tr key={book.id} className="hover:bg-orange-50/40 transition-colors group">
              {/* Title + description */}
              <td className="px-4 py-3 max-w-xs">
                <p className="font-medium text-gray-900 leading-snug">{book.name}</p>
                {book.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{book.description}</p>
                )}
              </td>

              {/* Category badge */}
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColor(book.category)}`}>
                  {book.category}
                </span>
              </td>

              {/* ISBN */}
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="font-mono text-xs text-gray-500">{book.sku}</span>
              </td>

              {/* Price */}
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="font-semibold text-gray-800">${book.price.toFixed(2)}</span>
              </td>

              {/* Quantity stepper */}
              <td className="px-4 py-3 whitespace-nowrap">
                <QuantityControl
                  value={book.quantity}
                  onChange={qty => handleQuantity(book, qty)}
                  disabled={updating === book.id}
                />
                {book.quantity === 0 && (
                  <span className="ml-2 text-xs text-red-500 font-medium">Out of stock</span>
                )}
                {book.quantity > 0 && book.quantity <= 10 && (
                  <span className="ml-2 text-xs text-amber-500 font-medium">Low stock</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(book)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit book"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(book)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove book"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
