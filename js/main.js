
const photoFiles = [
  {
    file: 'IMG_20260930_150950.jpg',
    alt: 'A sunny day out in the city'
  },
  {
    file: 'Messenger_creation_BF27B3C8-C36F-41A0-8B91-E884485140DC.jpeg',
    alt: 'A playful thermal-camera selfie'
  },
  {
    file: 'FORFEIT.jpg',
    alt: 'A childhood photo with Snoopy'
  },
  {
    file: 'RENE.jpg',
    alt: 'A black-and-white selfie'
  },
  {
    file: 'TECHNICALLY.jpg',
    alt: 'A selfie wearing glasses'
  },
  {
    file: 'KAINIS.jpg',
    alt: 'A collection of favorite photos'
  }
];

const photoGarden = document.getElementById('photo-garden');
const photoRevealStagger = 1450;
const photoFadeDuration = 1700;
const photoZoomDuration = 5200;
const photoFocusDuration = 2800;
const photoResetPause = 650;
const photoZoomEasing = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
const sceneCamera = document.getElementById('scene-camera');
const photoCards = photoFiles.map(({ file, alt }, index) => {
  const card = document.createElement('figure');
  const image = document.createElement('img');

  card.className = `photo-card photo-card--${index + 1}`;
  card.style.setProperty('--reveal-delay', `${index * photoRevealStagger}ms`);
  image.className = 'photo-card__image';
  image.src = `images/Kit/${encodeURIComponent(file)}`;
  image.alt = alt;
  image.loading = 'eager';
  card.append(image);
  photoGarden.append(card);

  return card;
});

onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");

    const titles = ('#TechnicallyMyFavorite').split('')
    const titleElement = document.getElementById('title');
    let index = 0;

    function appendTitle() {
      if (index < titles.length) {
        titleElement.innerHTML += titles[index];
        index++;
        setTimeout(appendTitle, 200); // 1000ms delay
      }
    }

    appendTitle();

    setTimeout(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        photoCards.forEach((card) => card.style.setProperty('--reveal-delay', '0ms'));
        photoGarden.classList.add('photo-garden--ready');
        return;
      }

      const showNextPhoto = async (index) => {
        if (index >= photoCards.length) {
          sceneCamera.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(0.88)' }],
            {
              duration: 6500,
              easing: photoZoomEasing,
              fill: 'forwards'
            }
          );
          return;
        }

        const card = photoCards[index];
        const image = card.querySelector('.photo-card__image');
        const imageBounds = image.getBoundingClientRect();
        const imageAspect = image.naturalWidth / image.naturalHeight;
        const isRotated = card.classList.contains('photo-card--4');
        const displayedAspect = isRotated ? 1 / imageAspect : imageAspect;
        const contentScale = isRotated ? 0.72 : 1;
        const containedWidth = Math.min(image.clientWidth, image.clientHeight * imageAspect);
        const containedHeight = containedWidth / imageAspect;
        const displayedWidth = (isRotated ? containedHeight : containedWidth) * contentScale;
        const displayedHeight = (isRotated ? containedWidth : containedHeight) * contentScale;
        const focusPoint = {
          x: imageBounds.left + imageBounds.width / 2,
          y: imageBounds.top + imageBounds.height / 2
        };
        const focusWidth = Math.min(window.innerWidth * 0.94, window.innerHeight * 0.9 * displayedAspect);
        const focusHeight = focusWidth / displayedAspect;
        const zoomScale = Math.min(focusWidth / displayedWidth, focusHeight / displayedHeight);
        const focusTransform = `translate(${window.innerWidth / 2 - focusPoint.x * zoomScale}px, ${window.innerHeight / 2 - focusPoint.y * zoomScale}px) scale(${zoomScale})`;
        const animationOptions = {
          duration: photoZoomDuration,
          easing: photoZoomEasing,
          fill: 'forwards'
        };

        card.classList.add('photo-card--featured');
        sceneCamera.style.transformOrigin = '0 0';
        const zoomIn = sceneCamera.animate(
          [{ transform: 'translate(0, 0) scale(1)' }, { transform: focusTransform }],
          animationOptions
        );
        await zoomIn.finished;

        await new Promise((resolve) => setTimeout(resolve, photoFocusDuration));

        const zoomOut = sceneCamera.animate(
          [{ transform: focusTransform }, { transform: 'translate(0, 0) scale(1)' }],
          animationOptions
        );
        await zoomOut.finished;
        zoomOut.cancel();
        zoomIn.cancel();
        sceneCamera.style.transformOrigin = 'center';
        card.classList.remove('photo-card--featured');

        await new Promise((resolve) => setTimeout(resolve, photoResetPause));
        await showNextPhoto(index + 1);
      };

      photoGarden.classList.add('photo-garden--ready');
      const revealDuration = photoFadeDuration + (photoCards.length - 1) * photoRevealStagger;

      setTimeout(() => {
        photoGarden.classList.add('photo-garden--floating');
        showNextPhoto(0);
      }, revealDuration + 500);
    }, 4200);

    clearTimeout(c);
  }, 1000);
};