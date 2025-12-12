// js/cartStore.js
const CART_ITEMS_KEY = 'cartItems';
const TOTAL_COUNT_KEY = 'totalCartCount';

export function loadCartItems() {
  return JSON.parse(localStorage.getItem(CART_ITEMS_KEY)) || [];
}

export function saveCartItems(items) {
  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
}

export function loadTotalCount() {
  return Number(localStorage.getItem(TOTAL_COUNT_KEY)) || 0;
}

export function saveTotalCount(count) {
  localStorage.setItem(TOTAL_COUNT_KEY, String(count));
}

export function clearCartStorage() {
  localStorage.removeItem(CART_ITEMS_KEY);
  localStorage.setItem(TOTAL_COUNT_KEY, '0');
}
