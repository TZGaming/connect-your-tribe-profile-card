// ---- AUDIO FUNCTIES ----
  window.play = function(audioId) {
    const audio = document.getElementById(audioId);
    if(audio) audio.play();
  };

  // ---- GIF CLICK FUNCTIE ----
  const image = document.getElementById('Bananza_icn');
  if(image){
    image.addEventListener('click', () => {
      const originalSrc = image.getAttribute('data-original');
      const gifSrc = image.getAttribute('data-gif');
      const duration = parseInt(image.getAttribute('data-duration'), 10);

      image.src = gifSrc;

      setTimeout(() => {
        image.src = originalSrc;
      }, duration);
    });
  }