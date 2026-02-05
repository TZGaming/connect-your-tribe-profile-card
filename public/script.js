let body = document.querySelector('body');
let Switch2All = document.querySelector('.Switch2');
let Switch2display = document.querySelector('#Switch2Console');
let behindScreenBackground = document.querySelector('#screen')
let unlockScreen = document.querySelector('.screen-unlock');
let ScreenContent = document.querySelector('.switch2-screen-content');
let Switch2Logo = document.querySelector('#switch2-logo');
let Time = document.querySelector('.screen-header')
let HomeButton = document.querySelector('#complete-home-button')
let HomeIcon = document.querySelector('#home-icon');
let HomeButton2 = document.querySelector('#home-button2');
let powerButton = document.querySelector('.power');
let VCicon = document.querySelector('#c');
let cButton = document.querySelector('#c-button');
let cButtonAll = document.querySelector('#c-button-all');
let Crossfade = document.querySelector('.crossfade');
let mainBlocks = document.querySelectorAll('.block-content');
let borderBlocks = document.querySelectorAll('.block-border');
let settingsBar = document.querySelector('.settings-bar')
let MKWorld = document.querySelector('.MKWorld');
let Bananza = document.querySelector('.Bananza');
let extraGames = document.querySelector('.extraGames');
let socials = document.querySelector('.socials');
let GitHub = document.querySelector('#github')
let AboutMeOverlay = document.querySelector('.about-overlay');
let FavGameOverlay = document.querySelector('.fav-game-overlay');
let ExtraGamesOverlay = document.querySelector('.extra-games-overlay')
let socialsOverlay = document.querySelector('.socials-overlay')
let overlayCloseBtn = document.querySelectorAll('.closeBtn');
let SecretMessage = document.querySelector('.easter-egg')

let isBooting = false;

let SettingsButton = document.querySelector('#settings');

Switch2Logo.addEventListener('click', function () {
    if (isBooting || Switch2Logo.classList.contains('logo-unlock')) return;
    
    isBooting = true;
    let switchContainer = document.querySelector('.Switch2');
    let style = window.getComputedStyle(switchContainer);

    mainBlocks.forEach(block => block.classList.add('no-interaction'));
    settingsOptions.forEach(opt => opt.classList.add('no-interaction'));

    Switch2Logo.style.cursor = 'default';
    
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
    Switch2All.style.animation = ''; 
    Switch2All.classList.add('tablet-unlocked-click');
    ScreenContent.classList.add('console-unlocked');
    
    document.querySelector('#Left-Joycon').classList.add('animate-click');
    document.querySelector('#Right-Joycon').classList.add('animate-click');

    setTimeout(() => {
        if (initialSoundBuffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = initialSoundBuffer;
            source.connect(audioCtx.destination);
            source.start(0);
        }
    }, 400);

    setTimeout(() => {
        isBooting = false;
        mainBlocks.forEach(block => block.classList.remove('no-interaction'));
        settingsOptions.forEach(opt => opt.classList.remove('no-interaction'));
        HomeIcon.classList.add('home-active');
        HomeButton2.classList.add('home-active');
        VCicon.classList.add('vc-active');
        cButton.classList.add('vc-active');
        Switch2All.classList.remove('tablet-unlocked-click');

        mainBlocks.forEach(block => block.style.pointerEvents = 'all');
    }, 5350);
});

powerButton.addEventListener('click', function (e) {
    if (isBooting) return;
    e.preventDefault();
    let switchContainer = document.querySelector('.Switch2');
    HomeIcon.classList.remove('home-active');
    HomeButton2.classList.remove('home-active');
    VCicon.classList.remove('vc-active');
    cButton.classList.remove('vc-active');

    removeLightMode()

    clearAllSelections()

    mainBlocks.forEach(block => block.classList.add('no-interaction'));
    settingsOptions.forEach(opt => opt.classList.add('no-interaction'));

    switchContainer.classList.remove('stop-animation');
    setTimeout(() => {
        switchContainer.style.translate = '';
        switchContainer.style.rotate = '';
        switchContainer.style.animation = ''; 
    }, 1000);

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
    Switch2Logo.style.cursor = 'pointer';
    setTimeout(() => {
        unlockScreen.classList.remove('unlocked');
        Switch2display.classList.remove('tablet-unlocked');
        ScreenContent.classList.remove('console-unlocked');
        HomeButton2.classList.remove('home-active');
        Switch2Logo.classList.remove('logo-unlock');
    }, 100);
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let initialSoundBuffer, blockSoundBuffer, settingsSoundBuffer, launchSoundBuffer, gamechatSoundBuffer, backSoundBuffer, homeSoundBuffer;
let nxonlineSoundBuffer, albumSoundBuffer, controllerSoundBuffer, eshopSoundBuffer, 
    gameshareSoundBuffer, newsSoundBuffer, powerSoundBuffer, settingsButtonSoundBuffer, cardsSoundBuffer;

async function loadAllSounds() {
    try {
        const responses = await Promise.all([
            fetch('snd/hover_1.wav'),
            fetch('snd/hover_2.wav'),
            fetch('snd/launch.wav'),
            fetch('snd/gamechat.wav'),
            fetch('snd/initial_boot.mp3'),
            fetch('snd/settings/nx_online.wav'),
            fetch('snd/settings/album.wav'),
            fetch('snd/settings/controller.wav'),
            fetch('snd/settings/eshop.wav'),
            fetch('snd/settings/gameshare.wav'),
            fetch('snd/settings/news.wav'),
            fetch('snd/settings/power.wav'),
            fetch('snd/settings/settings.wav'),
            fetch('snd/settings/virtual_gamecards.wav'),
            fetch('snd/back.wav'),
            fetch('snd/home.wav')
        ]);
        
        const data = await Promise.all(responses.map(res => res.arrayBuffer()));

        blockSoundBuffer          = await audioCtx.decodeAudioData(data[0]);
        settingsSoundBuffer       = await audioCtx.decodeAudioData(data[1]);
        launchSoundBuffer         = await audioCtx.decodeAudioData(data[2]);
        gamechatSoundBuffer       = await audioCtx.decodeAudioData(data[3]);
        initialSoundBuffer        = await audioCtx.decodeAudioData(data[4]);
        nxonlineSoundBuffer       = await audioCtx.decodeAudioData(data[5]);
        albumSoundBuffer          = await audioCtx.decodeAudioData(data[6]);
        controllerSoundBuffer     = await audioCtx.decodeAudioData(data[7]);
        eshopSoundBuffer          = await audioCtx.decodeAudioData(data[8]);
        gameshareSoundBuffer      = await audioCtx.decodeAudioData(data[9]);
        newsSoundBuffer           = await audioCtx.decodeAudioData(data[10]);
        powerSoundBuffer          = await audioCtx.decodeAudioData(data[11]);
        settingsButtonSoundBuffer = await audioCtx.decodeAudioData(data[12]);
        cardsSoundBuffer          = await audioCtx.decodeAudioData(data[13]);
        backSoundBuffer          = await audioCtx.decodeAudioData(data[14]);
        homeSoundBuffer          = await audioCtx.decodeAudioData(data[15]);
    } catch (err) {
    }
}

loadAllSounds();

const panner = new StereoPannerNode(audioCtx, { pan: 0 });
panner.connect(audioCtx.destination);

const settingOptionsClick = document.querySelectorAll('.settings-options');

settingOptionsClick.forEach(option => {
    option.addEventListener('click', async function () {
        if (isBooting || !Switch2display.classList.contains('tablet-unlocked')) return;
        if (audioCtx.state === 'suspended') await audioCtx.resume();

        const rect = option.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const panValue = (centerX / window.innerWidth) * 2 - 1;
        panner.pan.value = panValue;

        let selectedBuffer = null;
        
        if (this.classList.contains('nx-online'))      selectedBuffer = nxonlineSoundBuffer;
        else if (this.classList.contains('album'))     selectedBuffer = albumSoundBuffer;
        else if (this.classList.contains('eshop'))     selectedBuffer = eshopSoundBuffer;
        else if (this.classList.contains('news'))      selectedBuffer = newsSoundBuffer;
        else if (this.classList.contains('gamechat'))  selectedBuffer = gamechatSoundBuffer;
        else if (this.classList.contains('gameshare')) selectedBuffer = gameshareSoundBuffer;
        else if (this.classList.contains('controller')) selectedBuffer = controllerSoundBuffer;
        else if (this.classList.contains('virtualcards')) selectedBuffer = cardsSoundBuffer;
        else if (this.classList.contains('settings'))  selectedBuffer = settingsButtonSoundBuffer;
        else if (this.classList.contains('power'))     selectedBuffer = powerSoundBuffer;

        if (selectedBuffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = selectedBuffer;
            source.connect(panner);
            source.start(0);
        }
    });
});

function clearAllSelections() {
    borderBlocks.forEach(b => b.classList.remove('active-block'));
    const settingsBorders = document.querySelectorAll('.settings-border');
    settingsBorders.forEach(b => b.classList.remove('active-setting'));
}

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

mainBlocks.forEach(block => {
    block.addEventListener('click', async function () {
        if (isBooting || !Switch2display.classList.contains('tablet-unlocked')) return;

        if (this.classList.contains('no-interaction')) return;

        if (isBooting || !Switch2display.classList.contains('tablet-unlocked')) return;

        if (audioCtx.state === 'suspended') await audioCtx.resume();

        const rect = block.getBoundingClientRect();
        const panValue = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
        panner.pan.value = panValue;

        if (launchSoundBuffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = launchSoundBuffer;
            source.connect(panner);
            source.start(0);
        }

        const parentBorder = block.closest('.block-border');
        if (parentBorder) {
            parentBorder.classList.add('game-click');
            setTimeout(() => parentBorder.classList.remove('game-click'), 200);
        }
    });
});

let isPlayingC = false;
cButtonAll.addEventListener('click', function () {
    if (isBooting || !Switch2display.classList.contains('tablet-unlocked') || isPlayingC) return;

    SecretMessage.classList.add('activate');
    cButtonAll.classList.add('no-interaction');

    isPlayingC = true;
    
    if (gamechatSoundBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = gamechatSoundBuffer;
        source.connect(audioCtx.destination);
        source.start(0);
    }

    setTimeout(() => {
        SecretMessage.classList.remove('activate');
        cButtonAll.classList.remove('no-interaction');
    }, 1000);

    setTimeout(() => { isPlayingC = false; }, 500); 
});

mainBlocks.forEach((block) => {
    block.addEventListener('mouseenter', () => {

        if (block.classList.contains('no-interaction')) return;

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

const allSettings = document.querySelectorAll('.settings-options');

allSettings.forEach(option => {
    option.addEventListener('click', function () {
        this.classList.add('inner-glow-pulse');
        this.classList.add('no-interaction');

        const img = this.querySelector('img');
        if (img) {
            img.classList.add('setting-default-click');
        }

        if (this.classList.contains('settings')) {
            this.classList.add('settings-icn-rotate');
        }

        setTimeout(() => {
            this.classList.remove('no-interaction');
            this.classList.remove('inner-glow-pulse');
            this.classList.remove('settings-icn-rotate');
            if (img) {
                img.classList.remove('setting-default-click');
            }
        }, 300);
    });
});

const gameLaunchSound = new Audio('snd/fire_game.mp3');
const closeSound = new Audio('snd/back.wav');

let isOverlayOpening = false;

function openGameOverlay(overlayElement, extraAction = null) {
    if (isOverlayOpening) return;
    
    isOverlayOpening = true;

    mainBlocks.forEach(block => block.classList.add('no-interaction'));
    settingsOptions.forEach(opt => opt.classList.add('no-interaction'));

    setTimeout(() => {
        overlayElement.classList.add('is-active');
        if (extraAction) extraAction();
        gameLaunchSound.play();
    }, 300);
}

overlayCloseBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        AboutMeOverlay.classList.remove('is-active');
        FavGameOverlay.classList.remove('is-active');
        ExtraGamesOverlay.classList.remove('is-active');
        socialsOverlay.classList.remove('is-active');
        
        mainBlocks.forEach(block => block.classList.remove('no-interaction'));
        settingsOptions.forEach(opt => opt.classList.remove('no-interaction'));
        
        isOverlayOpening = false; 
        
        closeSound.play();
        const video = FavGameOverlay.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 45;
        }
    });
});

MKWorld.addEventListener('click', function () {
    if (this.classList.contains('no-interaction')) return;
    openGameOverlay(AboutMeOverlay);
});

Bananza.addEventListener('click', function () {
    if (this.classList.contains('no-interaction')) return;
    
    openGameOverlay(FavGameOverlay, () => {
        const video = FavGameOverlay.querySelector('video');
        if (video) {
            video.muted = false;
            video.volume = 0.4;
            video.currentTime = 45;
            video.play();
        }
    });
});

extraGames.addEventListener('click', function () {
    if (this.classList.contains('no-interaction')) return;
    openGameOverlay(ExtraGamesOverlay);
});

socials.addEventListener('click', function () {
    if (this.classList.contains('no-interaction')) return;
    openGameOverlay(socialsOverlay);
});

HomeButton.addEventListener('click', function () {
    if (isBooting || !Switch2display.classList.contains('tablet-unlocked') || isPlayingC) return;

    toggleLightMode()

    HomeButton.classList.add('no-interaction');

    isPlayingC = true;
    
    if (homeSoundBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = homeSoundBuffer;
        source.connect(audioCtx.destination);
        source.start(0);
    }

    setTimeout(() => { isPlayingC = false; HomeButton.classList.remove('no-interaction'); }, 500); 
});

function toggleLightMode() {

    body.classList.toggle('darkmode-text2');

    behindScreenBackground.classList.toggle('darkmode');

    mainBlocks.forEach(block => {
        block.classList.toggle('darkmode');
    });

    Time.classList.toggle('darkmode-text');

    settingsBar.classList.toggle('darkmode-full-white');

    settingsOptions.forEach(opt => {
        opt.classList.toggle('darkmode-full-white');
    });

    AboutMeOverlay.classList.toggle('darkmode-full-white');
    AboutMeOverlay.classList.toggle('darkmode-text');
    AboutMeOverlay.classList.toggle('darkmode-shadow');

    FavGameOverlay.classList.toggle('darkmode-full-white');
    FavGameOverlay.classList.toggle('darkmode-text');
    FavGameOverlay.classList.toggle('darkmode-shadow');

    ExtraGamesOverlay.classList.toggle('darkmode-full-white');
    ExtraGamesOverlay.classList.toggle('darkmode-text');
    FavGameOverlay.classList.toggle('darkmode-shadow');

    socialsOverlay.classList.toggle('darkmode-full-white');
    socialsOverlay.classList.toggle('darkmode-text');
    FavGameOverlay.classList.toggle('darkmode-shadow');

    overlayCloseBtn.forEach(btn => {
        btn.classList.toggle('inverted-img');
    });

    GitHub.classList.toggle('inverted-img');
}

function removeLightMode() {
    body.classList.remove('darkmode-text2');

    behindScreenBackground.classList.remove('darkmode');

    mainBlocks.forEach(block => {
        block.classList.remove('darkmode');
    });

    Time.classList.remove('darkmode-text');

    settingsBar.classList.remove('darkmode-full-white');

    settingsOptions.forEach(opt => {
        opt.classList.remove('darkmode-full-white');
    });

    AboutMeOverlay.classList.remove('darkmode-full-white');
    AboutMeOverlay.classList.remove('darkmode-text');
    AboutMeOverlay.classList.remove('darkmode-shadow');

    FavGameOverlay.classList.remove('darkmode-full-white');
    FavGameOverlay.classList.remove('darkmode-text');
    FavGameOverlay.classList.remove('darkmode-shadow');

    ExtraGamesOverlay.classList.remove('darkmode-full-white');
    ExtraGamesOverlay.classList.remove('darkmode-text');
    FavGameOverlay.classList.remove('darkmode-shadow');

    socialsOverlay.classList.remove('darkmode-full-white');
    socialsOverlay.classList.remove('darkmode-text');
    FavGameOverlay.classList.remove('darkmode-shadow');

    overlayCloseBtn.forEach(btn => {
        btn.classList.remove('inverted-img');
    });

    GitHub.classList.remove('inverted-img');
}