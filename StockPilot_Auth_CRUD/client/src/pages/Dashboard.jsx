import { useEffect, useMemo, useState } from "react";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await apiRequest("/api/products?limit=50");
      setProducts(data.products);
    } catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadProducts(); }, []);

  const mine = useMemo(() => products.filter((product) => (product.owner?._id || product.owner) === user.id), [products, user.id]);
  const stats = useMemo(() => ({ total: mine.length, units: mine.reduce((sum, item) => sum + item.stock, 0), low: mine.filter((item) => item.stock <= 5).length, categories: new Set(mine.map((item) => item.category)).size }), [mine]);

  function openCreate() { setEditing(null); setFormErrors([]); setModalOpen(true); }
  function openEdit(product) { setEditing(product); setFormErrors([]); setModalOpen(true); }

  async function saveProduct(payload) {
    setBusy(true); setFormErrors([]); setMessage("");
    try {
      if (editing) await apiRequest(`/api/products/${editing._id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await apiRequest("/api/products", { method: "POST", body: JSON.stringify(payload) });
      setModalOpen(false); setEditing(null); setMessage(editing ? "Product updated successfully." : "Product created successfully.");
      await loadProducts();
    } catch (error) { setFormErrors(error.details || []); if (!(error.details || []).length) setMessage(error.message); }
    finally { setBusy(false); }
  }

  async function deleteProduct() {
    if (!deleting) return;
    setBusy(true); setMessage("");
    try {
      await apiRequest(`/api/products/${deleting._id}`, { method: "DELETE" });
      setDeleting(null); setMessage("Product deleted successfully.");
      await loadProducts();
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="dashboard shell">
      <section className="dashboard-head"><div><span className="eyebrow">Protected workspace</span><h1>Your product control room</h1><p>Create, inspect, update and delete the products you own. Every write request is protected by the access-token middleware.</p></div><button className="button button-primary" onClick={openCreate}>+ Add product</button></section>
      {message && <div className={`notice ${message.includes("successfully") ? "success" : "error"}`}>{message}</div>}
      <section className="stats-grid"><article><span>Products</span><strong>{stats.total}</strong><small>Your catalog entries</small></article><article><span>Inventory</span><strong>{stats.units}</strong><small>Total units in stock</small></article><article><span>Low stock</span><strong>{stats.low}</strong><small>5 units or fewer</small></article><article><span>Categories</span><strong>{stats.categories}</strong><small>Across your catalog</small></article></section>
      <section className="manage-panel"><div className="section-title"><div><span className="eyebrow">CRUD management</span><h2>My products</h2></div><p>{mine.length} owned by {user.name}</p></div>{loading ? <div className="empty-state"><div className="spinner"></div><h3>Loading products</h3></div> : mine.length ? <div className="product-table-wrap"><table className="product-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Updated</th><th></th></tr></thead><tbody>{mine.map((product) => <tr key={product._id}><td><div className="table-product"><div>{product.imageUrl ? <img src={product.imageUrl} alt="" /> : product.name.charAt(0).toUpperCase()}</div><span><strong>{product.name}</strong><small>{product.description}</small></span></div></td><td><span className="table-tag">{product.category}</span></td><td>₹{Number(product.price).toLocaleString("en-IN")}</td><td>{product.stock}</td><td>{new Date(product.updatedAt).toLocaleDateString()}</td><td><div className="table-actions"><button className="text-button" onClick={() => openEdit(product)}>Edit</button><button className="text-button danger-text" onClick={() => setDeleting(product)}>Delete</button></div></td></tr>)}</tbody></table></div> : <div className="empty-state"><span className="empty-icon">＋</span><h3>No products yet</h3><p>Create your first product to demonstrate the complete CRUD flow.</p><button className="button button-primary" onClick={openCreate}>Add first product</button></div>}</section>
      <ProductFormModal open={modalOpen} product={editing} onClose={() => !busy && setModalOpen(false)} onSubmit={saveProduct} busy={busy} serverErrors={formErrors} />
      <ConfirmModal open={Boolean(deleting)} title="Delete this product?" message={deleting ? `${deleting.name} will be permanently removed from the catalog. This action cannot be undone.` : ""} busy={busy} onCancel={() => setDeleting(null)} onConfirm={deleteProduct} />
    </main>
  );
}
