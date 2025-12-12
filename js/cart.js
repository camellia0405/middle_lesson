// js/cart.js
import { getProducts } from './products.js';
import {
  loadCartItems,
  saveCartItems,
  loadTotalCount,
  saveTotalCount,
  clearCartStorage
} from './cartStore.js';
import { updateCartBadge } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const allProducts = await getProducts();
    initCartPage(allProducts);
    updateCartBadge(); // 右上バッジ初期表示
  } catch (e) {
    console.error('商品データの読み込みに失敗しました:', e);
  }
});

function initCartPage(allProducts) {
  const cartContainer = document.getElementById('cart-items');
  const emptyMessage = document.getElementById('empty-message');
  const totalPriceElement = document.getElementById('total-price');
  const clearButton = document.getElementById('clear-cart');

  if (!cartContainer || !totalPriceElement) return;

  let cartItems = loadCartItems();

  function renderCart() {
    cartContainer.innerHTML = '';
    cartItems = loadCartItems();

    if (cartItems.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      totalPriceElement.textContent = '合計金額：¥0';
      updateCartBadge(0);
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    let total = 0;

    cartItems.forEach((item, index) => {
      const product = allProducts.find(p => p.title === item.title);
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
    bindDeleteButtons();
  }

  function bindDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.cart__delete');

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = Number(e.currentTarget.dataset.index);
        const deletedItem = cartItems[idx];
        if (!deletedItem) return;

        // 合計カウント調整
        let totalCount = loadTotalCount();
        totalCount -= deletedItem.count;
        if (totalCount < 0) totalCount = 0;

        // 配列から削除
        cartItems.splice(idx, 1);
        saveCartItems(cartItems);
        saveTotalCount(totalCount);
        updateCartBadge(totalCount);

        renderCart();
      });
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (!confirm('カートを空にしますか？')) return;
      clearCartStorage();
      updateCartBadge(0);
      renderCart();
    });
  }

  renderCart();
}
