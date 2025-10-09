// ===============================
// 共通データ管理 (1回だけ読み込み)
// ===============================
if (!window.productsData) {
  fetch('./data/products.json')
    .then(res => res.json())
    .then(data => {
      window.productsData = data; // 全ページ共通で使えるようにする
      console.log("✅ 商品データを読み込みました", window.productsData);

      // 初期化イベントを発火して他JSに通知
      document.dispatchEvent(new CustomEvent("productsLoaded"));
    })
    .catch(err => console.error("商品データの読み込みエラー:", err));
}
