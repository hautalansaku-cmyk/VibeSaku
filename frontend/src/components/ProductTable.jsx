import { useState } from 'react';

function QtyControl({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleInputBlur = () => {
    const num = parseInt(inputVal);
    if (!isNaN(num) && num >= 0) onChange(num);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="qty-control">
        <input
          className="input"
          style={{ width: '70px', padding: '4px 8px', textAlign: 'center', fontSize: '14px' }}
          type="number"
          min="0"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={e => { if (e.key === 'Enter') handleInputBlur(); if (e.key === 'Escape') setEditing(false); }}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="qty-control">
      <button className="qty-btn" onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0} title="Decrease">−</button>
      <span
        className="qty-display"
        onClick={() => { setInputVal(String(value)); setEditing(true); }}
        title="Click to type a value"
        style={{ cursor: 'pointer', padding: '4px 6px', borderRadius: '6px', transition: 'background 0.15s' }}
        onMouseEnter={e => e.target.style.background = 'var(--secondary)'}
        onMouseLeave={e => e.target.style.background = 'transparent'}
      >
        {value}
      </span>
      <button className="qty-btn" onClick={() => onChange(value + 1)} title="Increase">+</button>
    </div>
  );
}

function StockBadge({ quantity }) {
  if (quantity === 0) return <span className="badge badge-danger">Out of Stock</span>;
  if (quantity <= 10) return <span className="badge badge-warning">Low Stock</span>;
  return <span className="badge badge-success">In Stock</span>;
}

const CATEGORY_CLASS = {
  'Picture Books': 'badge-cat-picture',
  'Board Books':   'badge-cat-board',
  'Early Readers': 'badge-cat-early',
  'Middle Grade':  'badge-cat-middle',
  'Young Adult':   'badge-cat-young',
  'Activity Books':'badge-cat-activity',
};

function CategoryBadge({ category }) {
  const cls = CATEGORY_CLASS[category] || 'badge-cat-other';
  return <span className={`badge-cat ${cls}`}>{category}</span>;
}

export default function ProductTable({ products, onQuantityChange, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>📭</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)' }}>No books found</div>
        <div style={{ fontSize: '14px', marginTop: '4px' }}>Try adjusting your search or filters</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            {['Title / Description', 'Category', 'ISBN / SKU', 'Price', 'Copies', 'Status', 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr
              key={product.id}
              style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.name}</div>
                {product.description && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.description}
                  </div>
                )}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <CategoryBadge category={product.category} />
              </td>
              <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>{product.sku}</td>
              <td style={{ padding: '14px 16px', fontWeight: 700 }}>${product.price.toFixed(2)}</td>
              <td style={{ padding: '14px 16px' }}>
                <QtyControl value={product.quantity} onChange={qty => onQuantityChange(product.id, qty)} />
              </td>
              <td style={{ padding: '14px 16px' }}>
                <StockBadge quantity={product.quantity} />
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(product)} title="Edit book">✏️</button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onDelete(product)} title="Delete book" style={{ color: 'var(--danger)' }}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
