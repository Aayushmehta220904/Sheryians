import { useEffect, useState } from "react";
import FieldErrors from "./FieldErrors";

const emptyForm = { name: "", description: "", category: "", price: "", stock: "", imageUrl: "" };

export default function ProductFormModal({ open, product, onClose, onSubmit, busy, serverErrors = [] }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    setForm(product ? {
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
    } : emptyForm);
  }, [open, product]);

  if (!open) return null;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
        <div className="modal-head">
          <div><span className="eyebrow">Catalog editor</span><h2 id="product-form-title">{product ? "Edit product" : "Add product"}</h2></div>
          <button className="icon-button" onClick={onClose} disabled={busy} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field full"><span>Product name</span><input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Mechanical Keyboard" required /><FieldErrors errors={serverErrors} field="name" /></label>
          <label className="field"><span>Category</span><input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Accessories" required /><FieldErrors errors={serverErrors} field="category" /></label>
          <label className="field"><span>Price (₹)</span><input type="number" min="0" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="4999" required /><FieldErrors errors={serverErrors} field="price" /></label>
          <label className="field"><span>Stock</span><input type="number" min="0" step="1" value={form.stock} onChange={(e) => update("stock", e.target.value)} placeholder="25" required /><FieldErrors errors={serverErrors} field="stock" /></label>
          <label className="field"><span>Image URL <em>optional</em></span><input type="url" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://..." /><FieldErrors errors={serverErrors} field="imageUrl" /></label>
          <label className="field full"><span>Description</span><textarea rows="5" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the product in at least 10 characters..." required /><FieldErrors errors={serverErrors} field="description" /></label>
          <div className="modal-actions full"><button type="button" className="button button-ghost" onClick={onClose} disabled={busy}>Cancel</button><button className="button button-primary" disabled={busy}>{busy ? "Saving..." : product ? "Save changes" : "Create product"}</button></div>
        </form>
      </div>
    </div>
  );
}
