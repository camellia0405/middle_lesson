// js/products.js

// 商品データを一度だけ保持するためのキャッシュ
let cache = null;

/**
 * 商品データを取得する関数
 * ・初回：fetchでJSONを取得
 * ・2回目以降：キャッシュを返す
 */
export async function getProducts() {
  // すでに読み込み済みなら、そのまま返す
  if (cache) return cache;

  // products.json を取得
  const res = await fetch('./data/products.json');

  // HTTPエラーの場合は例外を投げる
  if (!res.ok) {
    throw new Error(`products.json fetch failed: ${res.status}`);
  }

  // JSONをパースしてキャッシュに保存
  cache = await res.json();

  // 呼び出し元へ商品データを返す
  return cache;
}
