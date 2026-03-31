export default function StatsBar({ stats }) {
  const cards = [
    { label: 'Total Titles', value: stats.total_products, icon: '📚', color: 'var(--primary)' },
    { label: 'Total Copies', value: stats.total_items?.toLocaleString(), icon: '📖', color: 'var(--accent)' },
    { label: 'Inventory Value', value: `$${stats.total_value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: '💰', color: '#d97706' },
    { label: 'Low Stock', value: stats.low_stock, icon: '⚠️', color: 'var(--warning)' },
    { label: 'Out of Stock', value: stats.out_of_stock, icon: '🚫', color: 'var(--danger)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: 'white',
          borderRadius: 'var(--radius)',
          padding: '18px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{card.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: card.color }}>{card.value ?? '—'}</div>
        </div>
      ))}
    </div>
  );
}
