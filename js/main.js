// js/main.js
import { initCarousel } from './carousel.js';
import { getProducts } from './products.js';
import {
  loadCartItems,
  saveCartItems,
  loadTotalCount,
  saveTotalCount
} from './cartStore.js';
import { updateCartBadge } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
  initCarousel();

  try {
    const products = await getProducts();
    renderProductCards(products);
    initAddToCart(products);
    updateCartBadge();
  } catch (e) {
    console.error('商品データの読み込みに失敗しました:', e);
  }
});

function renderProductCards(products) {
  const container = document.querySelector('.products__grid');
  if (!container) return;

  container.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('article');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="product-card__image">
      <div class="product-card__content">
        <h3 class="product-card__title">${p.title}</h3>
        <p class="product-card__description">${p.description}</p>
        <p class="product-card__price">¥${p.price}(税込)</p>
        <button class="product-card__add-to-cart" aria-label="カートに入れる">
          <span class="product-card__count">0</span>
          <img src="./img/cart.png" alt="カートアイコン" class="product-card__cart-icon">
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function initAddToCart(products) {
  const buttons = document.querySelectorAll('.product-card__add-to-cart');
  if (!buttons.length) return;

  let cartItems = loadCartItems();
  let totalCount = loadTotalCount();

  // カード側の個数バッジ初期反映
  buttons.forEach((button, i) => {
    const product = products[i];
    const badge = button.querySelector('.product-card__count');
    const currentItem = cartItems.find(item => item.title === product.title);
    const count = currentItem ? currentItem.count : 0;

    if (badge && count > 0) {
      badge.textContent = String(count);
      badge.style.display = 'inline-block';
    }
  });

  updateCartBadge(totalCount);

  buttons.forEach((button, i) => {
    const product = products[i];
    const badge = button.querySelector('.product-card__count');

    button.addEventListener('click', () => {
      totalCount += 1;
      saveTotalCount(totalCount);
      updateCartBadge(totalCount);

      const existing = cartItems.find(item => item.title === product.title);
      if (existing) {
        existing.count += 1;
      } else {
        cartItems.push({
          title: product.title,
          price: product.price,
          img: product.img,
          count: 1
        });
      }

      saveCartItems(cartItems);

      const currentItem = cartItems.find(item => item.title === product.title);
      if (badge && currentItem) {
        badge.textContent = String(currentItem.count);
        badge.style.display = 'inline-block';
      }
    });
  });
}
