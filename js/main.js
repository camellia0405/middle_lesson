// ===============================
// 各モジュールの読み込み
// ===============================

// カルーセル専用モジュール
import { initCarousel } from './carousel.js';

// 商品データ取得（JSONを1回だけ読む）モジュール
import { getProducts } from './products.js';

// カート状態（localStorage）を扱うモジュール
import {
  loadCartItems,   // カート内商品一覧を取得
  saveCartItems,   // カート内商品一覧を保存
  loadTotalCount,  // カート合計個数を取得
  saveTotalCount   // カート合計個数を保存
} from './cartStore.js';

// ヘッダー右上のカート個数バッジ更新用モジュール
import { updateCartBadge } from './common.js';


// ===============================
// ページ初期化処理
// ===============================
// HTMLの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', async () => {

  // カルーセルを初期化
  //（DOMを直接操作するため、DOM生成後に実行）
  initCarousel();

  try {
    // 商品データを取得（products.json）
    const products = await getProducts();

    // 商品カードをHTMLとして生成・表示
    renderProductCards(products);

    // 「カートに入れる」ボタンのイベントを設定
    initAddToCart(products);
    updateCartBadge(); // 右上バッジ初期表示（localStorageから）
  } catch (e) {
    console.error('商品データの読み込みに失敗しました:', e);
  }
});

function initCarousel() {
  const items = document.querySelectorAll('.carousel__item');
  const nextButton = document.querySelector('.carousel__button--next');
  const prevButton = document.querySelector('.carousel__button--prev');
  let currentIndex = 0;

  if (!items.length || !nextButton || !prevButton) return;

  function showSlide(index) {
    items.forEach(item => (item.style.display = 'none'));
    items[index].style.display = 'block';
  }

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide(currentIndex);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(currentIndex);
  });

  showSlide(currentIndex);
}

function renderProductCards(products) {
  const container = document.querySelector('.products__grid');
  if (!container) return;

  // 一度中身を空にする（再描画対策）
  container.innerHTML = '';

  products.forEach(p => {
    // article要素を生成
    const card = document.createElement('article');
    card.classList.add('product-card');

    // 商品情報をHTMLとして流し込む
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

    // DOMに追加
    container.appendChild(card);
  });
}


// ===============================
// カート追加処理
// ===============================
// 「カートに入れる」ボタンの挙動を設定する
function initAddToCart(products) {
  const buttons = document.querySelectorAll('.product-card__add-to-cart');
  if (!buttons.length) return;

  // localStorageから現在のカート状態を取得
  let cartItems = loadCartItems();
  let totalCount = loadTotalCount();

  // -------------------------------
  // 各商品カードの「個数バッジ」初期反映
  // -------------------------------
  buttons.forEach((button, i) => {
    const product = products[i];
    const badge = button.querySelector('.product-card__count');

    // すでにカートに入っている商品があれば、その個数を表示
    const currentItem = cartItems.find(item => item.title === product.title);
    const count = currentItem ? currentItem.count : 0;

    if (badge && count > 0) {
      badge.textContent = String(count);
      badge.style.display = 'inline-block';
    }
  });

  // ヘッダー右上の合計個数も更新
  updateCartBadge(totalCount);

  // -------------------------------
  // 「カートに入れる」クリック処理
  // -------------------------------
  buttons.forEach((button, i) => {
    const product = products[i];
    const badge = button.querySelector('.product-card__count');

    button.addEventListener('click', () => {

      // 合計個数を1増やす
      totalCount += 1;
      saveTotalCount(totalCount);
      updateCartBadge(totalCount);

      // カート内に同じ商品があるか確認
      const existing = cartItems.find(item => item.title === product.title);

      if (existing) {
        // すでにある場合は数量を増やす
        existing.count += 1;
      } else {
        // 初めて追加する商品
        cartItems.push({
          title: product.title,
          price: product.price,
          img: product.img,
          count: 1
        });
      }

      // カート内容をlocalStorageに保存
      saveCartItems(cartItems);

      // 商品カード側の個数バッジを更新
      const currentItem = cartItems.find(item => item.title === product.title);
      if (badge && currentItem) {
        badge.textContent = String(currentItem.count);
        badge.style.display = 'inline-block';
      }
    });
  });
}
