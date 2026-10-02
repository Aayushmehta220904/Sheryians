import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    apiRequest("/api/products?limit=50", {}, false)
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))].sort(), [products]);
  const filtered = useMemo(() => products.filter((product) => {
    const text = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (!category || product.category === category);
  }), [products, search, category]);

  return (
    <main>
      <section className="hero-section shell">
        <div className="hero-copy">
          <span className="eyebrow">Secure commerce starter</span>
          <h1>Products in public.<br /><span>Control in the right hands.</span></h1>
          <p>StockPilot combines a public product catalog with protected product management, JWT access tokens, rotating refresh tokens, validation, and complete CRUD.</p>
          <div className="hero-actions">{isAuthenticated ? <Link className="button button-primary" to="/dashboard">Manage catalog</Link> : <Link className="button button-primary" to="/register">Create an account</Link>}<a className="button button-ghost" href="#catalog">Browse products</a></div>
          <div className="trust-row"><span>JWT access token</span><span>httpOnly refresh cookie</span><span>Validated CRUD</span></div>
        </div>
        <div className="hero-panel">
          <div className="terminal-head"><span></span><span></span><span></span><strong>secure-session.flow</strong></div>
          <div className="flow-step"><b>01</b><div><strong>Authenticate</strong><small>Email + password verified with bcrypt</small></div><span>✓</span></div>
          <div className="flow-line"></div>
          <div className="flow-step"><b>02</b><div><strong>Issue access</strong><small>Short-lived JWT for protected APIs</small></div><span>15m</span></div>
          <div className="flow-line"></div>
          <div className="flow-step"><b>03</b><div><strong>Refresh safely</strong><small>Long-lived httpOnly cookie + server revocation</small></div><span>7d</span></div>
        </div>
      </section>

      <section className="catalog-section shell" id="catalog">
        <div className="section-title"><div><span className="eyebrow">Public catalog</span><h2>Explore the inventory</h2></div><p>{filtered.length} product{filtered.length === 1 ? "" : "s"} shown</p></div>
        <div className="catalog-toolbar"><div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or categories" /></div><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
        {loading ? <div className="empty-state"><div className="spinner"></div><h3>Loading catalog</h3></div> : error ? <div className="notice error">{error}</div> : filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product._id} product={product} />)}</div> : <div className="empty-state"><span className="empty-icon">□</span><h3>No products found</h3><p>{products.length ? "Try another search or category." : "The catalog is empty. Sign in and add the first product."}</p></div>}
      </section>
    </main>
  );
}
