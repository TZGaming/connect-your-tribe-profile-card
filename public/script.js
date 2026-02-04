let Switch2display = document.querySelector('#Switch2Console');
let unlockScreen = document.querySelector('.screen-unlock');
let ScreenContent = document.querySelector('.switch2-screen-content');
let Switch2Logo = document.querySelector('#switch2-logo');
let HomeIcon = document.querySelector('#home-icon');
let HomeButton2 = document.querySelector('#home-button2');
let HomeComplete = document.querySelector('#complete-home-button');
let VCicon = document.querySelector('#c');
let cButton = document.querySelector('#c-button');
let cButtonAll = document.querySelector('#c-button-all');
let Crossfade = document.querySelector('.crossfade');
let mainBlocks = document.querySelectorAll('.block-content');
let borderBlocks = document.querySelectorAll('.block-border');
let isBooting = false;

const allBlocks = document.querySelectorAll('.block-content-wrapper');

HomeComplete.addEventListener('click', function (e) {
    if (isBooting) return;
    e.preventDefault();
    let switchContainer = document.querySelector('.Switch2');
    HomeButton2.classList.add('home-active');
    borderBlocks.forEach(b => b.classList.remove('active-block'));
    switchContainer.classList.remove('stop-animation');
    setTimeout(() => {
        switchContainer.style.translate = '';
        switchContainer.style.rotate = '';
        switchContainer.style.animation = ''; 
    }, 1000);
    mainBlocks.forEach(block => {
      block.style.pointerEvents = 'none';
    });
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

Switch2Logo.addEventListener('click', function () {
    if (isBooting || Switch2Logo.classList.contains('logo-unlock')) return;
    isBooting = true;
    let switchContainer = document.querySelector('.Switch2');
    let style = window.getComputedStyle(switchContainer);
    switchContainer.style.translate = style.translate;
    switchContainer.style.rotate = style.rotate;
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
    setTimeout(function() {
        isBooting = false;
        HomeIcon.classList.add('home-active');
        HomeButton2.classList.add('home-active');
        VCicon.classList.add('vc-active');
        cButton.classList.add('vc-active');


        mainBlocks.forEach(block => {
            block.style.pointerEvents = 'all';

            block.addEventListener('click', async function () {

                if (audioCtx.state === 'suspended') {
                    await audioCtx.resume();
                }

                allBlocks.forEach(block => {
                    block.addEventListener('click', function() {
                    this.classList.add('game-click');

                setTimeout(() => {
                    this.classList.remove('game-click');
                }, 200);
    });
})
                const rect = block.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const screenWidth = window.innerWidth;
                const panValue = (centerX / screenWidth) * 2 - 1;
        
                panner.pan.value = panValue;

                try {
                    const response = await fetch('snd/launch.wav');
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

                    const source = audioCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(panner);
                    source.start(0);
                } catch (err) {
                }
          });
    });

        let isPlayingC = false;
        cButtonAll.addEventListener('click', function () {
          if (isPlayingC) return;
          isPlayingC = true;
          const audio = new Audio('snd/gamechat.wav');
          audio.play();
          setTimeout(() => { isPlayingC = false; }, 500); 
        });
    }, 5350);
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let initialSoundBuffer, blockSoundBuffer, settingsSoundBuffer, launchSoundBuffer, gamechatSoundBuffer;

async function loadAllSounds() {
    try {
        // Haal alle bestanden op
        const responses = await Promise.all([
            fetch('snd/hover_1.wav'),
            fetch('snd/hover_2.wav'),
            fetch('snd/launch.wav'),
            fetch('snd/gamechat.wav'),
            fetch('snd/initial_boot.mp3')
        ]);
        
        // Zet ze allemaal om naar arrayBuffers
        const data = await Promise.all(responses.map(res => res.arrayBuffer()));

        // Decodeer ze naar audio buffers
        blockSoundBuffer = await audioCtx.decodeAudioData(data[0]);
        settingsSoundBuffer = await audioCtx.decodeAudioData(data[1]);
        launchSoundBuffer = await audioCtx.decodeAudioData(data[2]);
        gamechatSoundBuffer = await audioCtx.decodeAudioData(data[3]);
        initialSoundBuffer = await audioCtx.decodeAudioData(data[4]);
    } catch (err) {
    }
}

loadAllSounds();

const panner = new StereoPannerNode(audioCtx, { pan: 0 });
panner.connect(audioCtx.destination);

// Universele reset functie
function clearAllSelections() {
    borderBlocks.forEach(b => b.classList.remove('active-block'));
    const settingsBorders = document.querySelectorAll('.settings-border');
    settingsBorders.forEach(b => b.classList.remove('active-setting'));
}

// Audio Helper met buffer keuze
function playHoverSound(element, buffer) {
    if (buffer) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const screenWidth = window.innerWidth;
        const panValue = (centerX / screenWidth) * 2 - 1;
        
        panner.pan.value = panValue;

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(panner);
        source.start(0);
    }
}

mainBlocks.forEach((block) => {
    block.addEventListener('mouseenter', () => {
        if (!isBooting) {
            const parentBorder = block.closest('.block-border');
            
            if (!parentBorder || parentBorder.classList.contains('active-block')) return;

            clearAllSelections();
            parentBorder.classList.add('active-block');

            playHoverSound(block, blockSoundBuffer);
        }
    });
});

const settingsOptions = document.querySelectorAll('.settings-options');
settingsOptions.forEach((option) => {
    option.addEventListener('mouseenter', () => {
        if (!isBooting) {
            const parentBorder = option.closest('.settings-border');
            
            if (!parentBorder || parentBorder.classList.contains('active-setting')) return;

            clearAllSelections();
            parentBorder.classList.add('active-setting');

            playHoverSound(option, settingsSoundBuffer);
        }
    });
});