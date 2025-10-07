document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const emptyMessage = document.getElementById("empty-message");
  const totalPriceElement = document.getElementById("total-price");
  const clearButton = document.getElementById("clear-cart");

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  function renderCart() {
    cartContainer.innerHTML = "";
    if (cartItems.length === 0) {
      emptyMessage.style.display = "block";
      totalPriceElement.textContent = "合計金額：¥0";
      return;
    }

    emptyMessage.style.display = "none";
    let total = 0;

    cartItems.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart__item");

      // 金額抽出（¥と(税込)を除去して数値化）
      const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ""));
      const itemTotal = numericPrice * item.count;
      total += itemTotal;

      div.innerHTML = `
        <p class="cart__title">${item.title}</p>
        <p class="cart__price">${item.price}</p>
        <p class="cart__count">数量：${item.count}</p>
        <p class="cart__subtotal">小計：¥${itemTotal.toLocaleString()}</p>
        <button class="cart__delete" data-index="${index}">削除</button>
      `;

      cartContainer.appendChild(div);
    });

    totalPriceElement.textContent = `合計金額：¥${total.toLocaleString()}`;
  }

  // 個別削除機能
  cartContainer.addEventListener("click", e => {
    if (e.target.classList.contains("cart__delete")) {
      const index = e.target.dataset.index;
      const deletedItem = cartItems[index];
      cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      // 全体カウント更新
      let totalCartCount = Number(localStorage.getItem("totalCartCount")) || 0;
      totalCartCount -= deletedItem.count;
      localStorage.setItem("totalCartCount", totalCartCount);

      renderCart();
    }
  });

  // 全削除
  clearButton.addEventListener("click", () => {
    if (!confirm("カートを空にしますか？")) return;
    cartItems = [];
    localStorage.removeItem("cartItems");
    localStorage.setItem("totalCartCount", 0);
    renderCart();
  });

  renderCart();
});
