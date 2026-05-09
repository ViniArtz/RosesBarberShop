// Pré-carregamento das imagens do carrossel
const imagensCarrossel = [
  'assets/images/IMG_0221.JPG',
  'assets/images/FUNDO_HERO.JPG',
  'assets/images/Interior_da_barbearia.jpg',
];

function precarregar(fontes) {
  return Promise.all(
    fontes.map(
      src =>
        new Promise(resolve => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // não bloqueia se uma imagem falhar
          img.src = src;
        })
    )
  );
}

function ocultarTela() {
  const tela = document.getElementById('tela-carregamento');
  tela.classList.add('oculto');
  tela.addEventListener('transitionend', () => tela.remove(), { once: true });
}

// Carrossel do Hero
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

  // Aguarda as imagens e só então inicia o carrossel e some a tela
  precarregar(imagensCarrossel).then(() => {
    ocultarTela();
    startAutoPlay();
  });
})();
