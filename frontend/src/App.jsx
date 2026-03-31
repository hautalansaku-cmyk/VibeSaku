import { useState, useEffect, useRef } from 'react';
import { api } from './api';
import StatsBar from './components/StatsBar';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import DeleteModal from './components/DeleteModal';
import './index.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = () => setRefreshKey(k => k + 1);

  // Track prev values to decide immediate vs debounced fetch
  const prevCategoryRef = useRef(selectedCategory);
  const prevRefreshKeyRef = useRef(refreshKey);

  useEffect(() => {
    const categoryChanged = selectedCategory !== prevCategoryRef.current;
    const forceRefresh = refreshKey !== prevRefreshKeyRef.current;
    prevCategoryRef.current = selectedCategory;
    prevRefreshKeyRef.current = refreshKey;

    const fetchData = () => {
      setLoading(true);
      setError(null);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      Promise.all([api.getProducts(params), api.getCategories(), api.getStats()])
        .then(([prods, cats, st]) => { setProducts(prods); setCategories(cats); setStats(st); })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    };

    if (categoryChanged || forceRefresh) {
      fetchData();
      return;
    }
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory, refreshKey]);

  const handleQuantityChange = async (id, qty) => {
    try {
      const updated = await api.updateQuantity(id, qty);
      setProducts(ps => ps.map(p => p.id === id ? updated : p));
      const st = await api.getStats();
      setStats(st);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleSave = async (data) => {
    try {
      if (editProduct) {
        await api.updateProduct(editProduct.id, data);
        showToast(`"${data.name}" updated successfully`);
      } else {
        await api.createProduct(data);
        showToast(`"${data.name}" added to inventory`);
      }
      setAddOpen(false);
      setEditProduct(null);
      refresh();
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      await api.deleteProduct(deleteProduct.id);
      showToast(`"${deleteProduct.name}" removed`);
      setDeleteProduct(null);
      refresh();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>

      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>📚</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>Little Reads</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' }}>INVENTORY MANAGER</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
            <span style={{ fontSize: '16px' }}>+</span> Add Book
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Filters card */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '340px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none' }}>🔍</span>
              <input
                className="input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search titles, ISBNs, authors…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Category filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['All', ...categories].map(cat => (
                <button
                  key={cat}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {loading ? 'Loading…' : `${products.length} ${products.length === 1 ? 'title' : 'titles'}`}
            </div>
          </div>

          {/* Table */}
          {error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
              <div style={{ fontWeight: 600 }}>Failed to load inventory</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{error}</div>
              <button className="btn btn-secondary" style={{ marginTop: '16px' }} onClick={refresh}>Retry</button>
            </div>
          ) : loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '28px' }}>📖</div>
          ) : (
            <ProductTable
              products={products}
              onQuantityChange={handleQuantityChange}
              onEdit={p => setEditProduct(p)}
              onDelete={p => setDeleteProduct(p)}
            />
          )}
        </div>

      </main>

      {/* Add / Edit modal */}
      {(addOpen || editProduct) && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setAddOpen(false); setEditProduct(null); }}
        />
      )}

      {/* Delete modal */}
      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onConfirm={handleDelete}
          onClose={() => setDeleteProduct(null)}
          deleting={deleting}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: toast.type === 'error' ? 'var(--danger)' : '#1c1007',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 100,
          animation: 'slideUp 0.2s ease',
          maxWidth: '360px'
        }}>
          {toast.type === 'error' ? '⚠️ ' : '✅ '}{toast.msg}
        </div>
      )}

    </div>
  );
}
