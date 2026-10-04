const title = document.querySelector('.title')
const text = `For u bussenggggg :P`.split('')

// Create container for better responsive layout
title.style.display = 'flex'
title.style.flexWrap = 'wrap'
title.style.justifyContent = 'center'
title.style.gap = '0.5rem'

for (let index = 0; index < text.length; index++) {
  if (text[index] !== ' ') {
    title.innerHTML += `<span>${text[index]}</span>`
  } else {
    title.innerHTML += `<span style='width: 1rem'></span>`
  }
}

const textElements = document.querySelectorAll('.title span');
textElements.forEach((element) => {
  const randomDelay = Math.random() * 3;
  element.style.animationDelay = `${randomDelay}s`;
});

const openButton = document.querySelector('.open-button-wrap .btn');
const songAudio = document.getElementById('song-audio');
const flowerScene = document.getElementById('flower-scene');
const playbackStatus = document.getElementById('playback-status');

openButton.addEventListener('click', (event) => {
  event.preventDefault();

  const playback = songAudio.play();
  flowerScene.src = 'flower.html';
  flowerScene.classList.add('flower-scene--visible');
  flowerScene.setAttribute('aria-hidden', 'false');

  playback.catch((error) => {
    flowerScene.classList.remove('flower-scene--visible');
    flowerScene.removeAttribute('src');
    flowerScene.setAttribute('aria-hidden', 'true');
    playbackStatus.textContent = 'The song could not be played. Check that the MP3 file is available and try again.';
    console.error('Song playback failed:', error);
  });
});