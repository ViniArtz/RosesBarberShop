(function () {
  const cards = document.querySelectorAll('.plan-card[data-copa-desconto]');

  cards.forEach(card => {
    const discount = parseInt(card.dataset.copaDesconto, 10);
    const hasGift = card.hasAttribute('data-copa-brinde');

    const priceEl = card.querySelector('p');
    const priceText = priceEl.textContent.trim();
    const valueStr = priceText.replace(/[^\d,]/g, '').replace(',', '.');
    const originalValue = parseFloat(valueStr);
    const discountedValue = originalValue * (1 - discount / 100);

    const formatted = discountedValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const banner = document.createElement('div');
    banner.className = 'copa-plano-banner';
    banner.innerHTML = `<i class="fa-solid fa-futbol"></i> Plano Seleção — ${discount}% OFF`;
    card.insertBefore(banner, card.firstChild);

    priceEl.classList.add('preco-original');

    const discountedPrice = document.createElement('p');
    discountedPrice.className = 'preco-copa';
    discountedPrice.textContent = `R$ ${formatted}/mês`;
    priceEl.insertAdjacentElement('afterend', discountedPrice);

    if (hasGift) {
      const gift = document.createElement('span');
      gift.className = 'copa-brinde-info';
      gift.textContent = '+ brinde temático na 1ª mensalidade';
      discountedPrice.insertAdjacentElement('afterend', gift);
    }
  });
})();

const carouselImages = [
  'assets/images/IMG_0221.JPG',
  'assets/images/FUNDO_HERO.JPG',
  'assets/images/Interior_da_barbearia.jpg',
];

function preload(sources) {
  return Promise.all(
    sources.map(
      src =>
        new Promise(resolve => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    )
  );
}

function hideScreen() {
  const screen = document.getElementById('tela-carregamento');
  screen.classList.add('oculto');
  screen.addEventListener('transitionend', () => screen.remove(), { once: true });
}

(function () {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  const lastIndex = slides.length - 1;
  let current = 0;
  let autoPlay;
  let animating = false;

  function updateArrows() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === lastIndex;
  }

  function clearClasses(slide) {
    slide.classList.remove('active', 'enter-right', 'enter-left', 'exit-left', 'exit-right');
  }

  function goTo(index, direction) {
    if (animating) return;
    animating = true;

    const prev = current;
    current = index;

    const enterClass = direction === 'next' ? 'enter-right' : 'enter-left';
    const exitClass  = direction === 'next' ? 'exit-left'  : 'exit-right';

    slides[current].style.transition = 'none';
    clearClasses(slides[current]);
    slides[current].classList.add(enterClass);

    slides[current].offsetWidth;
    slides[current].style.transition = '';

    slides[prev].classList.remove('active');
    slides[prev].classList.add(exitClass);
    dots[prev].classList.remove('active');

    slides[current].classList.remove(enterClass);
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    updateArrows();

    setTimeout(() => {
      clearClasses(slides[prev]);
      animating = false;
    }, 800);
  }

  function next() {
    if (current === lastIndex) return;
    goTo(current + 1, 'next');
  }

  function prev() {
    if (current === 0) return;
    goTo(current - 1, 'prev');
  }

  function startAutoPlay() {
    autoPlay = setInterval(() => {
      if (current === lastIndex) {
        clearInterval(autoPlay);
        return;
      }
      next();
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    if (current < lastIndex) startAutoPlay();
  }

  nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
  prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (i === current) return;
      const direction = i > current ? 'next' : 'prev';
      goTo(i, direction);
      resetAutoPlay();
    });
  });

  updateArrows();

  preload(carouselImages).then(() => {
    hideScreen();
    startAutoPlay();
  });
})();
