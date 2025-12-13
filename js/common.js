// js/common.js
import { loadTotalCount } from './cartStore.js';

/**
 * ヘッダーのカートバッジを更新
 * @param {number} [count] // 指定がなければlocalStorageから読む
 */

export function updateCartBadge(count = loadTotalCount()) {
  const el = document.querySelector('.cart-count');
  if (!el) return;
  el.textContent = String(count);
}
