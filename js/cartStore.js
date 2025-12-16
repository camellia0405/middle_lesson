// js/cartStore.js

/**
 * localStorage に保存する際のキー名
 * ※ 文字列を直接あちこちに書かないため、定数としてまとめている
 */
const CART_ITEMS_KEY = 'cartItems';
const TOTAL_COUNT_KEY = 'totalCartCount';

/**
 * カート内の商品一覧を取得する
 * - localStorage から JSON を読み込み
 * - まだ何も保存されていない場合は空配列を返す
 *
 * @returns {Array} カート内の商品配列
 */
export function loadCartItems() {
  return JSON.parse(localStorage.getItem(CART_ITEMS_KEY)) || [];
}

/**
 * カート内の商品一覧を保存する
 * - 配列を JSON 文字列に変換して localStorage に保存
 * @param {Array} items 保存したいカート商品配列
 */
export function saveCartItems(items) {
  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
}

/**
 * カート内の「合計個数」を取得する
 * - localStorage から数値として読み込む
 * - 未保存の場合は 0 を返す
 *
 * @returns {number} カート内の合計商品数
 */
export function loadTotalCount() {
  return Number(localStorage.getItem(TOTAL_COUNT_KEY)) || 0;
}

/**
 * カート内の「合計個数」を保存する
 *
 * @param {number} count 保存したい合計個数
 */
export function saveTotalCount(count) {
  localStorage.setItem(TOTAL_COUNT_KEY, String(count));
}

/**
 * カート情報をすべてリセットする
 * - 商品一覧を削除
 * - 合計個数を 0 に戻す
 *
 * ※ 「カートを空にする」ボタン用
 */
export function clearCartStorage() {
  localStorage.removeItem(CART_ITEMS_KEY);
  localStorage.setItem(TOTAL_COUNT_KEY, '0');
}
