export default function ProductCard({ product }) {
  const stockState = product.stock === 0 ? "Out of stock" : product.stock <= 5 ? "Low stock" : "In stock";
  const stockClass = product.stock === 0 ? "danger" : product.stock <= 5 ? "warning" : "success";

  return (
    <article className="product-card">
      <div className="product-visual">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-fallback"><span>{product.name.charAt(0).toUpperCase()}</span></div>
        )}
        <span className={`status-pill ${stockClass}`}>{stockState}</span>
      </div>
      <div className="product-body">
        <div className="product-meta"><span>{product.category}</span><span>{product.stock} units</span></div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>₹{Number(product.price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
          <small>Added by {product.owner?.name || "member"}</small>
        </div>
      </div>
    </article>
  );
}
