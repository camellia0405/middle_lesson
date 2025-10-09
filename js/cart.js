document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("productsLoaded", () => {
    const allProducts = window.productsData;
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartContainer = document.getElementById("cart-items");
    const emptyMessage = document.getElementById("empty-message");
    const totalPriceElement = document.getElementById("total-price");
    const clearButton = document.getElementById("clear-cart");

    // カートが空の場合
    if (cartItems.length === 0) {
      emptyMessage.style.display = "block";
      totalPriceElement.textContent = "合計金額：¥0";
      return;
    }

    emptyMessage.style.display = "none";
    renderCart();

    // ===============================
    // カート描画関数
    // ===============================
    function renderCart() {
      cartContainer.innerHTML = ""; // 一旦クリア
      let total = 0;

      cartItems.forEach((item, index) => {
        const product = allProducts.find(p => p.title === item.title);
        const price = product ? product.price : item.price;
        const image = product ? product.img : "./img/noimage.png"; // 商品画像を取得
        const subtotal = price * item.count;
        total += subtotal;

        const div = document.createElement("div");
        div.classList.add("cart__item");
        div.innerHTML = `
          <div class="cart__item-image">
            <img src="${image}" alt="${item.title}">
          </div>
          <div class="cart__item-info">
            <p class="cart__title">${item.title}</p>
            <p class="cart__price">単価：¥${price}</p>
            <p class="cart__count">数量：${item.count}</p>
            <p class="cart__subtotal">小計：¥${subtotal.toLocaleString()}</p>
          </div>
          <button class="cart__delete" data-index="${index}">削除</button>
        `;
        cartContainer.appendChild(div);
      });

      totalPriceElement.textContent = `合計金額：¥${total.toLocaleString()}`;
      addDeleteEvent();
    }

    // ===============================
    // 削除ボタン機能
    // ===============================
    function addDeleteEvent() {
      const deleteButtons = document.querySelectorAll(".cart__delete");
      deleteButtons.forEach(btn => {
        btn.addEventListener("click", e => {
          const idx = e.target.dataset.index;
          const deletedItem = cartItems[idx];

          // 合計カウントを調整
          let totalCount = Number(localStorage.getItem("totalCartCount")) || 0;
          totalCount -= deletedItem.count;
          if (totalCount < 0) totalCount = 0;

          // 商品削除
          cartItems.splice(idx, 1);
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          localStorage.setItem("totalCartCount", totalCount);

          // 再描画
          renderCart();

          // カート数の反映
          const cartCountElement = document.querySelector(".cart-count");
          if (cartCountElement) cartCountElement.textContent = totalCount;

          // 空になったらメッセージ表示
          if (cartItems.length === 0) {
            emptyMessage.style.display = "block";
            totalPriceElement.textContent = "合計金額：¥0";
          }
        });
      });
    }

    // ===============================
    // 「カートを空にする」ボタン機能
    // ===============================
    clearButton.addEventListener("click", () => {
      if (confirm("カートを空にしますか？")) {
        localStorage.removeItem("cartItems");
        localStorage.setItem("totalCartCount", 0);
        cartContainer.innerHTML = "";
        totalPriceElement.textContent = "合計金額：¥0";
        emptyMessage.style.display = "block";

        const cartCountElement = document.querySelector(".cart-count");
        if (cartCountElement) cartCountElement.textContent = "0";
      }
    });
  });
});
