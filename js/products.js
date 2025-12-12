// js/products.js
let cache = null;

export async function getProducts() {
  if (cache) return cache;

  const res = await fetch('./data/products.json');
  if (!res.ok) throw new Error(`products.json fetch failed: ${res.status}`);

  cache = await res.json();
  return cache;
}
