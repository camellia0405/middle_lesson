// js/common.js

// cartStore.js から「カートの合計数を取得する関数」を読み込む
// → common.js 自体は localStorage の中身を直接知らない設計
import { loadTotalCount } from './cartStore.js';

/**
 * ヘッダー右上の「カート件数バッジ」を更新する関数
 *
 * @param {number} [count]
 *   ・引数を渡した場合：その数値をそのまま表示
 *   ・引数を省略した場合：localStorage に保存されている
 *     合計件数を loadTotalCount() で取得して表示
 *
 * 例:
 *   updateCartBadge(3);  // 強制的に「3」を表示
 *   updateCartBadge();   // localStorage の値を表示
 */

export function updateCartBadge(count = loadTotalCount()) {
  // ヘッダー内のカート件数表示要素を取得
  const el = document.querySelector('.cart-count');

  // カートバッジが存在しないページ（例：要素が無いHTML）の場合は何もしない
  if (!el) return;

  // 数値を文字列に変換して表示
  el.textContent = String(count);
}
