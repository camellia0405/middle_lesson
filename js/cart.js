// js/cart.js
import { getProducts } from './products.js';
import {
  loadCartItems,
  saveCartItems,
  loadTotalCount,
  saveTotalCount,
  updateCartBadge
} from './cartStore.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const products = await getProducts();
    initCartPage(products);
  } catch (e) {
    console.error('商品データの読み込みに失敗しました:', e);
    // 商品データがなくても localStorage の価格情報だけで表示は可能
    initCartPage(null);
  }
});

/**
 * カートページ初期化
 */
function initCartPage(allProducts) {
  const cartItems = loadCartItems();
  const cartContainer = document.getElementById('cart-items');
  const emptyMessage = document.getElementById('empty-message');
  const totalPriceElement = document.getElementById('total-price');
  const clearButton = document.getElementById('clear-cart');

  if (!cartContainer || !totalPriceElement || !emptyMessage) return;

  if (!cartItems.length) {
    emptyMessage.style.display = 'block';
    totalPriceElement.textContent = '合計金額：¥0';
    return;
  }

  emptyMessage.style.display = 'none';
  renderCart();

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (!confirm('カートを空にしますか？')) return;

      saveCartItems([]);
      saveTotalCount(0);

      cartContainer.innerHTML = '';
      totalPriceElement.textContent = '合計金額：¥0';
      emptyMessage.style.display = 'block';
      updateCartBadge(0);
    });
  }

  /**
   * カートの中身を描画
   */
  function renderCart() {
    const items = loadCartItems();
    cartContainer.innerHTML = '';
    let total = 0;

    items.forEach((item, index) => {
      const product = allProducts
        ? allProducts.find(p => p.title === item.title)
        : null;

      const price = product ? product.price : item.price;
      const image = product ? product.img : './img/noimage.png';
      const subtotal = price * item.count;
      total += subtotal;

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

    totalPriceElement.textContent = `合計金額：¥${total.toLocaleString()}`;
    attachDeleteEvents();
  }

  /**
   * 削除ボタンのイベント
   */
  function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.cart__delete');

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = Number(e.currentTarget.dataset.index);
        const items = loadCartItems();
        const deletedItem = items[idx];
        if (!deletedItem) return;

        let totalCount = loadTotalCount();
        totalCount -= deletedItem.count;
        if (totalCount < 0) totalCount = 0;

        items.splice(idx, 1);
        saveCartItems(items);
        saveTotalCount(totalCount);
        updateCartBadge(totalCount);

        if (!items.length) {
          cartContainer.innerHTML = '';
          emptyMessage.style.display = 'block';
          totalPriceElement.textContent = '合計金額：¥0';
        } else {
          renderCart();
        }
      });
    });
  }
}
