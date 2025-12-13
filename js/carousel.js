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
