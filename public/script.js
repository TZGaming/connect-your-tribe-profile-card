let Switch2display = document.querySelector('#Switch2Console');
let unlockScreen = document.querySelector('.screen-unlock');
let ScreenContent = document.querySelector('.switch2-screen-content');
let Switch2Logo = document.querySelector('#switch2-logo');
let HomeButton2 = document.querySelector('#home-button2');
let HomeComplete = document.querySelector('#complete-home-button');
let Crossfade = document.querySelector('.crossfade');

// Deze variabele houdt bij of de animatie nog bezig is
let isBooting = false;

// STAP 1: De Home Button listener staat nu ALTIJD aan, 
// maar voert de code alleen uit als isBooting 'false' is.
HomeComplete.addEventListener('click', function (e) {
    if (isBooting) {
        return;
    }

    e.preventDefault();
    let switchContainer = document.querySelector('.Switch2');

    // --- DE VLOEIENDE RESET LOGICA ---
    switchContainer.classList.remove('stop-animation');

    setTimeout(() => {
        switchContainer.style.translate = '';
        switchContainer.style.rotate = '';
        switchContainer.style.animation = ''; 
    }, 1000);
    
    setTimeout(() => {
      Crossfade.classList.add('activate-crossfade');
  
      setTimeout(() => {
        Crossfade.classList.remove('activate-crossfade');
      }, 1000);
    }, 700);

    requestAnimationFrame(() => {
        const allAnimations = document.getAnimations();
        allAnimations.forEach(anim => {
            if (anim.animationName && (anim.animationName.includes('unlock') || anim.animationName.includes('logo'))) {
                anim.playbackRate = -5;
                anim.play();
            }
        });
    });

    document.getElementById('Left-Joycon').classList.remove('animate-click');
    document.getElementById('Right-Joycon').classList.remove('animate-click');

    setTimeout(() => {
        unlockScreen.classList.remove('unlocked');
        Switch2display.classList.remove('tablet-unlocked');
        ScreenContent.classList.remove('console-unlocked');
        HomeButton2.classList.remove('home-active');
        Switch2Logo.classList.remove('logo-unlock');
    }, 100);
});

// STAP 2: De Logo klik start het proces en zet de blokkade aan
Switch2Logo.addEventListener('click', function () {
    // Zet de blokkade direct aan
    isBooting = true;

    let switchContainer = document.querySelector('.Switch2');
    
    let style = window.getComputedStyle(switchContainer);
    let currentTranslate = style.translate;
    let currentRotate = style.rotate;

    switchContainer.style.translate = currentTranslate;
    switchContainer.style.rotate = currentRotate;
    switchContainer.style.animation = 'none';

    requestAnimationFrame(() => {
        switchContainer.classList.add('stop-animation');
        switchContainer.style.translate = '';
        switchContainer.style.rotate = '';
    });

    Switch2Logo.classList.add('logo-unlock');
    unlockScreen.classList.add('unlocked');
    Switch2display.classList.add('tablet-unlocked');
    ScreenContent.classList.add('console-unlocked');

    document.querySelector('#Left-Joycon').classList.add('animate-click');
    document.querySelector('#Right-Joycon').classList.add('animate-click');
    
    setTimeout(function() {
        new Audio('snd/initial_boot.mp3').play();
    }, 400);

    // STAP 3: Pas na 5,35 seconden heffen we de blokkade op
    setTimeout(function() {
        isBooting = false;
    }, 5350);
});