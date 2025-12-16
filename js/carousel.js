// js/carousel.js

/**
 * カルーセル（スライダー）を初期化する関数
 *
 * 引数は「セレクタをまとめた設定オブジェクト」
 * 省略した場合はデフォルト値が使われる
 */
export function initCarousel({
  itemSelector = '.carousel__item',          // 各スライド要素
  nextSelector = '.carousel__button--next',  // 次へボタン
  prevSelector = '.carousel__button--prev'   // 前へボタン
} = {}) {

  // ===============================
  // DOM要素の取得
  // ===============================

  // すべてのスライド要素を取得（NodeList）
  const items = document.querySelectorAll(itemSelector);

  // 「次へ」「前へ」ボタンを取得
  const nextButton = document.querySelector(nextSelector);
  const prevButton = document.querySelector(prevSelector);

  // 現在表示中のスライド番号（0始まり）
  let currentIndex = 0;

  // ===============================
  // ガード節（存在チェック）
  // ===============================
  // スライド or ボタンが存在しない場合は何もしない
  // （別ページでも安全に読み込めるようにするため）
  if (!items.length || !nextButton || !prevButton) return;

  // ===============================
  // 指定したインデックスのスライドを表示する関数
  // ===============================
  function showSlide(index) {
    // すべてのスライドを一旦非表示にする
    items.forEach(item => {
      item.style.display = 'none';
    });

    // 指定されたスライドだけ表示
    items[index].style.display = 'block';
  }

  // ===============================
  // 「次へ」ボタンの処理
  // ===============================
  nextButton.addEventListener('click', () => {
    // インデックスを1つ進める
    // % items.length により最後の次は最初に戻る
    currentIndex = (currentIndex + 1) % items.length;

    // 表示を更新
    showSlide(currentIndex);
  });

  // ===============================
  // 「前へ」ボタンの処理
  // ===============================
  prevButton.addEventListener('click', () => {
    // インデックスを1つ戻す
    // マイナスにならないように items.length を足してから % を取る
    currentIndex = (currentIndex - 1 + items.length) % items.length;

    // 表示を更新
    showSlide(currentIndex);
  });

  // ===============================
  // 初期表示
  // ===============================
  // ページ読み込み時は最初のスライドを表示
  showSlide(currentIndex);
}
// js/carousel.js

export function initCarousel({
  itemSelector = '.carousel__item',
  nextSelector = '.carousel__button--next',
  prevSelector = '.carousel__button--prev'
} = {}) {
  const items = document.querySelectorAll(itemSelector);
  const nextButton = document.querySelector(nextSelector);
  const prevButton = document.querySelector(prevSelector);

  let currentIndex = 0;

  if (!items.length || !nextButton || !prevButton) return;

  function showSlide(index) {
    items.forEach(item => {
      item.style.display = 'none';
    });
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
