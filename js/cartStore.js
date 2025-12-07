// js/cartStore.js
const CART_ITEMS_KEY = 'cartItems';
const CART_TOTAL_KEY = 'totalCartCount';

/**
 * カート内の商品配列を取得
 */
export function loadCartItems() {
  try {
    const raw = localStorage.getItem(CART_ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * カート内の商品配列を保存
 */
export function saveCartItems(items) {
  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
}

/**
 * 合計個数を取得
 */
export function loadTotalCount() {
  const n = Number(localStorage.getItem(CART_TOTAL_KEY));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/**
 * 合計個数を保存
 */
export function saveTotalCount(count) {
  localStorage.setItem(CART_TOTAL_KEY, String(count));
}

/**
 * 右上のバッジを更新
 */
export function updateCartBadge(count = loadTotalCount()) {
  const el = document.querySelector('.cart-count');
  if (el) el.textContent = count;
}
