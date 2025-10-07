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

  nextButton?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide(currentIndex);
  });

  prevButton?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(currentIndex);
  });

  showSlide(currentIndex);

  // ========================
  // カート機能
  // ========================
  const cartCountElement = document.querySelector(".cart-count");
  const addToCartButtons = document.querySelectorAll(".product-card__add-to-cart");
  let totalCartCount = Number(localStorage.getItem("totalCartCount")) || 0;
  cartCountElement.textContent = totalCartCount;

  // 既存カート情報を読み込み
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  addToCartButtons.forEach(button => {
    const card = button.closest(".product-card");
    const title = card.querySelector(".product-card__title").textContent;
    const price = card.querySelector(".product-card__price").textContent;
    const cardCountElement = card.querySelector(".product-card__count");
    let count = 0;

    button.addEventListener("click", () => {
      // 全体カウント更新
      totalCartCount++;
      cartCountElement.textContent = totalCartCount;

      // 商品個別カウント更新
      count++;
      cardCountElement.textContent = count;
      cardCountElement.style.display = "inline-block";

      // localStorage保存処理
      const existingItem = cartItems.find(item => item.title === title);
      if (existingItem) {
        existingItem.count++;
      } else {
        cartItems.push({ title, price, count: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("totalCartCount", totalCartCount);
    });
  });
});
