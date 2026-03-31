import type { Book } from '../types';

interface Props {
  books: Book[];
}

export default function StatsBar({ books }: Props) {
  const totalBooks = books.length;
  const totalStock = books.reduce((s, b) => s + b.quantity, 0);
  const totalValue = books.reduce((s, b) => s + b.price * b.quantity, 0);
  const lowStock = books.filter(b => b.quantity > 0 && b.quantity <= 10).length;
  const outOfStock = books.filter(b => b.quantity === 0).length;

  const stats = [
    {
      label: 'Titles',
      value: totalBooks,
      icon: '📚',
      color: 'bg-violet-50 border-violet-200',
      textColor: 'text-violet-700',
      valueColor: 'text-violet-900',
    },
    {
      label: 'Total Stock',
      value: totalStock.toLocaleString(),
      icon: '📦',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-900',
    },
    {
      label: 'Inventory Value',
      value: `$${totalValue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
      valueColor: 'text-emerald-900',
    },
    {
      label: 'Low Stock',
      value: lowStock,
      icon: '⚠️',
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
      valueColor: 'text-amber-900',
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      icon: '🚫',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      valueColor: 'text-red-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500">{s.label}</span>
            <span className="text-lg">{s.icon}</span>
          </div>
          <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
