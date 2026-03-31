export default function DeleteModal({ product, onConfirm, onClose, deleting }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <h2 className="modal-title">🗑️ Remove Book</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Are you sure you want to remove <strong style={{ color: 'var(--text-primary)' }}>{product?.name}</strong> from the inventory?
            This action cannot be undone.
          </p>
          <div style={{ marginTop: '16px', padding: '14px', background: 'var(--danger-light)', borderRadius: '8px', border: '1px solid #fca5a5' }}>
            <div style={{ fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>
              {product?.sku} · ${product?.price?.toFixed(2)} · {product?.quantity} {product?.quantity === 1 ? 'copy' : 'copies'}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={deleting}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? '⏳ Removing...' : '🗑️ Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}
