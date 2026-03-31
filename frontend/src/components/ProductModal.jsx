import { useState, useEffect } from 'react';

const EMPTY = { name: '', category: '', sku: '', price: '', quantity: '0', description: '' };

export default function ProductModal({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);

  const isEdit = Boolean(product);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        sku: product.sku,
        price: String(product.price),
        quantity: String(product.quantity),
        description: product.description || ''
      });
      setCustomCategory(!categories.includes(product.category));
    } else {
      setForm(EMPTY);
      setCustomCategory(false);
    }
    setErrors({});
  }, [product, categories]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Title is required';
    if (!form.category.trim()) e.category = 'Category is required';
    if (!form.sku.trim()) e.sku = 'ISBN / SKU is required';
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) e.price = 'Valid price is required';
    if (form.quantity === '' || isNaN(parseInt(form.quantity)) || parseInt(form.quantity) < 0) e.quantity = 'Valid quantity is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        category: form.category.trim(),
        sku: form.sku.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        description: form.description.trim()
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '✏️ Edit Book' : '📗 Add Book'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            <div className="form-group">
              <label className="form-label">Book Title *</label>
              <input className="input" placeholder="e.g. The Very Hungry Caterpillar" value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category *</label>
                {customCategory ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input className="input" placeholder="New category" value={form.category} onChange={e => set('category', e.target.value)} />
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setCustomCategory(false); set('category', ''); }} title="Pick existing">↩</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => { setCustomCategory(true); set('category', ''); }}>+ New</button>
                  </div>
                )}
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">ISBN / SKU *</label>
                <input className="input" placeholder="e.g. ISBN-9780399226908" value={form.sku} onChange={e => set('sku', e.target.value)} />
                {errors.sku && <div className="form-error">{errors.sku}</div>}
              </div>
            </div>

            <div style={{ height: '16px' }} />

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Price ($) *</label>
                <input className="input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={e => set('price', e.target.value)} />
                {errors.price && <div className="form-error">{errors.price}</div>}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Copies in Stock *</label>
                <input className="input" type="number" min="0" placeholder="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
                {errors.quantity && <div className="form-error">{errors.quantity}</div>}
              </div>
            </div>

            <div style={{ height: '16px' }} />

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Author / Description</label>
              <textarea className="input" rows={3} placeholder="e.g. Eric Carle · Ages 2–5 · Hardcover" value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical', minHeight: '80px' }} />
            </div>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Saving...' : isEdit ? '✅ Save Changes' : '📗 Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
