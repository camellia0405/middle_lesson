// js/cart.js

// 商品データ取得（products.jsonを1回だけ読む仕組み）
import { getProducts } from './products.js';

// カート状態を localStorage から読み書きする責務を持つモジュール
import {
  loadCartItems,
  saveCartItems,
  loadTotalCount,
  saveTotalCount,
  clearCartStorage
} from './cartStore.js';

// ヘッダー右上の「カート個数バッジ」を更新する共通処理
import { updateCartBadge } from './common.js';

/**
 * DOMの読み込み完了後にカートページを初期化
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 商品一覧を取得（キャッシュがあれば再fetchしない）
    const allProducts = await getProducts();

    // カートページの初期化
    initCartPage(allProducts);

    // ヘッダーのカートバッジを初期表示
    updateCartBadge();
  } catch (e) {
    console.error('商品データの読み込みに失敗しました:', e);
  }
});

/**
 * カートページ全体の初期化処理
 * @param {Array} allProducts - products.json の全商品データ
 */
function initCartPage(allProducts) {
  // DOM要素取得
  const cartContainer = document.getElementById('cart-items');
  const emptyMessage = document.getElementById('empty-message');
  const totalPriceElement = document.getElementById('total-price');
  const clearButton = document.getElementById('clear-cart');

  // 必須要素がなければ何もしない（他ページでの誤動作防止）
  if (!cartContainer || !totalPriceElement) return;

  // 現在のカート内容を取得
  let cartItems = loadCartItems();

  /**
   * カートの中身を描画する関数
   * - localStorage の内容を元にDOMを再生成
   * - 合計金額を計算
   */
  function renderCart() {
    cartContainer.innerHTML = '';
    cartItems = loadCartItems();

    // カートが空の場合
    if (cartItems.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      totalPriceElement.textContent = '合計金額：¥0';
      updateCartBadge(0);
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    let total = 0;

    // 各商品を1件ずつ描画
    cartItems.forEach((item, index) => {
      // 商品マスタ（products.json）から該当商品を検索
      const product = allProducts.find(p => p.title === item.title);

      // マスタが無い場合はカート保存時の値を使う
      const price = product ? product.price : item.price;
      const image = product ? product.img : './img/noimage.png';

      const subtotal = price * item.count;
      total += subtotal;

      // カート内の商品DOM生成
      const div = document.createElement('div');
      div.classList.add('cart__item');
      div.innerHTML = `
        <div class="cart__item-image">
          <img src="${image}" alt="${item.title}">
        </div>
        <div class="cart__item-info">
          <p class="cart__title">${item.title}</p>
          <p class="cart__price">単価：¥${price.toLocaleString()}</p>
          <p class="cart__count">数量：${item.count}</p>
          <p class="cart__subtotal">小計：¥${subtotal.toLocaleString()}</p>
        </div>
        <button class="cart__delete" data-index="${index}">削除</button>
      `;
      cartContainer.appendChild(div);
    });

    // 合計金額表示
    totalPriceElement.textContent = `合計金額：¥${total.toLocaleString()}`;

    // 削除ボタンにイベントを付与
    bindDeleteButtons();
  }

  /**
   * 各「削除」ボタンのクリックイベント設定
   */
  function bindDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.cart__delete');

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        // data-index から削除対象を特定
        const idx = Number(e.currentTarget.dataset.index);
        const deletedItem = cartItems[idx];
        if (!deletedItem) return;

        // 合計個数を調整
        let totalCount = loadTotalCount();
        totalCount -= deletedItem.count;
        if (totalCount < 0) totalCount = 0;

        // 配列から商品削除
        cartItems.splice(idx, 1);

        // localStorage更新
        saveCartItems(cartItems);
        saveTotalCount(totalCount);

        // バッジ更新
        updateCartBadge(totalCount);

        // 再描画
        renderCart();
      });
    });
  }

  /**
   * 「カートを空にする」ボタン処理
   */
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (!confirm('カートを空にしますか？')) return;

      // localStorageを初期状態に戻す
      clearCartStorage();

      // バッジも0に
      updateCartBadge(0);

      // 再描画
      renderCart();
    });
  }

  // 初回描画
  renderCart();
}
