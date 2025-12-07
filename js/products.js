// js/products.js
let productsCache = null;

/**
 * 商品一覧を取得する（キャッシュ付き）
 */
export async function getProducts() {
  if (productsCache) return productsCache;

  const res = await fetch('./data/products.json');
  if (!res.ok) {
    throw new Error('商品データの取得に失敗しました');
  }
  productsCache = await res.json();
  return productsCache;
}
