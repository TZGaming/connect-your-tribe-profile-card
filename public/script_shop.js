// Algemene variabelen
let body = document.querySelector('body');
let Switch2All = document.querySelector('.Switch2');
let Switch2Console = document.querySelector('#Switch2Console');
let Switch2Screen = document.querySelector('#Main')
let behindScreenBackground = document.querySelector('#screen')
let unlockScreen = document.querySelector('.screen-unlock');
let ScreenContent = document.querySelector('.switch2-screen-content');
let Switch2Logo = document.querySelector('#switch2-logo');
let Time = document.querySelector('.screen-header')
let JoyConLeftColor = document.querySelectorAll('.left-joycon-color')
let JoyConLeftThumbstick = document.querySelector('#left-stick')
let JoyConRightThumbstick = document.querySelector('#right-stick')
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
let SettingsButton = document.querySelector('#settings');
let AboutBlock = document.querySelector('.MKWorld');
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

// Boolean voor als de boot sequence klaar is
let isBooting = false;

// Soundbuffer systeem voor audio, dit voorkomt latency en de geluiden spelen sneller af
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let initialSoundBuffer, blockSoundBuffer, settingsSoundBuffer, launchSoundBuffer, gamechatSoundBuffer, backSoundBuffer, homeSoundBuffer, fireGameSoundBuffer;
let nxonlineSoundBuffer, albumSoundBuffer, controllerSoundBuffer, eshopSoundBuffer, 
    gameshareSoundBuffer, newsSoundBuffer, powerSoundBuffer, settingsButtonSoundBuffer, cardsSoundBuffer;

// Paden naar alle geluiden
async function loadAllSounds() {
    try {
        const responses = await Promise.all([
            fetch('/snd/hover_1.wav'),
            fetch('/snd/hover_2.wav'),
            fetch('/snd/launch.wav'),
            fetch('/snd/gamechat.wav'),
            fetch('/snd/initial_boot.mp3'),
            fetch('/snd/settings/nx_online.wav'),
            fetch('/snd/settings/album.wav'),
            fetch('/snd/settings/controller.wav'),
            fetch('/snd/settings/eshop.wav'),
            fetch('/snd/settings/gameshare.wav'),
            fetch('/snd/settings/news.wav'),
            fetch('/snd/settings/power.wav'),
            fetch('/snd/settings/settings.wav'),
            fetch('/snd/settings/virtual_gamecards.wav'),
            fetch('/snd/back.wav'),
            fetch('/snd/home.wav'),
            fetch('/snd/fire_game.mp3')
        ]);
        
        // Download alle geluiden in 1 keer, scheelt opstart tijd
        const data = await Promise.all(responses.map(res => res.arrayBuffer()));

        // Audio omgezet naar binaire datastroom (?), zelf nog even kijken of ik dit beter kan begrijpen
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
        fireGameSoundBuffer          = await audioCtx.decodeAudioData(data[16]);
    } catch (err) {
    }
}

// Voer Soundbuffer functie uit zodra de pagina is geladen
loadAllSounds();

// Geluid panning, hiermee worden sommige geluiden afgespeeld aan de rechter of linker kant. Het ligt er aan waar je muis zit op het scherm
const panner = new StereoPannerNode(audioCtx, { pan: 0 });
panner.connect(audioCtx.destination);

// Speelt een geluid af als je over 1 van de 4 blokken hovered met je muis, ook weer met panning
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

// Gamechat button op de joy con die een geluidje speelt als je er op klikt
let isPlayingC = false;
cButtonAll.addEventListener('click', function () {
    if (isBooting || !Switch2Console.classList.contains('tablet-unlocked') || isPlayingC) return;

    // 👀
    SecretMessage.classList.add('activate');

    // Niet meteen opnieuw klikken
    cButtonAll.classList.add('no-interaction');

    // Boolean word op true gezet, daarna kan je voor 1 seconde niet opnieuw op de button klikken
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
        isPlayingC = false;
    }, 1000);
});

// Joy con accent color changer
// Lijst met kleuren, maakt gebruik van indexes
const colors = [
    'rgb(194, 0, 0)',   // Rood
    'rgb(231, 216, 45)',   // Geel
    'rgb(0, 194, 0)',   // Groen
    'rgb(0, 192, 225)', // Blauw
    'rgb(116, 0, 194)', // Paars
    'rgb(214, 119, 195)', // Roze
    'rgb(116,235,255)', // L Standaard
    'rgb(255,162,145)' // R Standaard
];

// Start de eerste kleur altijd bij rood
let colorIndex = 0;

// Verander de kleur van de linker joy con
// Alleen als de console unlocked is zodat het niet geactiveerd kan worden in de boot sequence
JoyConLeftThumbstick.addEventListener('click', function () {
    if (isBooting || !Switch2Console.classList.contains('tablet-unlocked')) return;

    const nextColor = colors[colorIndex];

    document.documentElement.style.setProperty('--colors-default-L', nextColor);

    colorIndex = (colorIndex + 1) % colors.length;
});

// Verander de kleur van de rechter joy con
// Ook alleen als de console unlocked is
JoyConRightThumbstick.addEventListener('click', function () {
    if (isBooting || !Switch2Console.classList.contains('tablet-unlocked')) return;

    const nextColor = colors[colorIndex];

    document.documentElement.style.setProperty('--colors-default-R', nextColor);

    colorIndex = (colorIndex + 1) % colors.length;
});

// Functie die beide joy con kleuren reset naar default
// Deze functie word aangeroepen wanneer je klikt op de power button
function resetJoyConColors() {
    // Index nummers van de const
    document.documentElement.style.setProperty('--colors-default-L', colors[6]);
    document.documentElement.style.setProperty('--colors-default-R', colors[7]);

    // Reset colorIndex zodat de volgende kleur weer rood word
    colorIndex = 0;
}

HomeButton.addEventListener('click', function () {
    window.location.href = '/';
});