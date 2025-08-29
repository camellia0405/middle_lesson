document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.carousel__item');
  const nextButton = document.querySelector('.carousel__button--next');
  const prevButton = document.querySelector('.carousel__button--prev');
  let currentIndex = 0;

  function showSlide(index) {
    // すべてのアイテムを非表示にする
    items.forEach(item => {
      item.style.display = 'none';
    });
    // 指定されたインデックスのアイテムを表示する
    items[index].style.display = 'block';
  }

  // 次の画像へ進む
  nextButton.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= items.length) {
      currentIndex = 0; // 最後のアイテムの次に進んだら最初に戻る
    }
    showSlide(currentIndex);
  });

  // 前の画像へ戻る
  prevButton.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = items.length - 1; // 最初のアイテムの前に戻ったら最後に行く
    }
    showSlide(currentIndex);
  });

  // ページロード時に最初のスライドを表示
  showSlide(currentIndex);
});
