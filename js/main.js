document.addEventListener('DOMContentLoaded', () => {
  // ========================
  // カルーセル機能
  // ========================
  const items = document.querySelectorAll('.carousel__item');
  const nextButton = document.querySelector('.carousel__button--next');
  const prevButton = document.querySelector('.carousel__button--prev');
  let currentIndex = 0;

  function showSlide(index) {
    items.forEach(item => item.style.display = 'none');
    items[index].style.display = 'block';
  }

  if (nextButton && prevButton && items.length > 0) {
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

  // ========================
  // 商品データ読込完了イベント
  // ========================
  document.addEventListener("productsLoaded", () => {
    const products = window.productsData;
    const container = document.querySelector(".products__grid");

    if (!container || !products) return;

    // 商品カード生成
    container.innerHTML = ""; // 一度クリアしてから生成
    products.forEach(p => {
      const card = document.createElement("article");
      card.classList.add("product-card");
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

    // カート機能を初期化
    initCartFeature();
  });

  // ========================
  // カート機能
  // ========================
  function initCartFeature() {
    const cartCountElement = document.querySelector(".cart-count");
    const addToCartButtons = document.querySelectorAll(".product-card__add-to-cart");

    let totalCount = Number(localStorage.getItem("totalCartCount")) || 0;
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // 初期表示
    if (cartCountElement) cartCountElement.textContent = totalCount;

    addToCartButtons.forEach((button, i) => {
      const product = window.productsData[i];
      const cardCountElement = button.querySelector(".product-card__count");
      const currentItem = cartItems.find(x => x.title === product.title);
      let cardCount = currentItem ? currentItem.count : 0;

      // 初期表示反映
      if (cardCount > 0) {
        cardCountElement.textContent = cardCount;
        cardCountElement.style.display = "inline-block";
      }

      // カート追加イベント
      button.addEventListener("click", () => {
        totalCount++;
        if (cartCountElement) cartCountElement.textContent = totalCount;

        const existing = cartItems.find(x => x.title === product.title);
        if (existing) {
          existing.count++;
          cardCount = existing.count;
        } else {
          cartItems.push({ title: product.title, price: product.price, count: 1 });
          cardCount = 1;
        }

        // 個別表示更新
        cardCountElement.textContent = cardCount;
        cardCountElement.style.display = "inline-block";

        // 保存
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("totalCartCount", totalCount);
      });
    });
  }
});
