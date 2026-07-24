const API = 'https://dummyjson.com';
export async function fetchProducts(){
  const res = await fetch(`${API}/products?limit=100`);
  if(!res.ok) throw new Error('Could not load products');
  const data = await res.json(); return data.products;
}
export async function fetchProduct(id){
  const res = await fetch(`${API}/products/${id}`);
  if(!res.ok) throw new Error('Product not found'); return res.json();
}
