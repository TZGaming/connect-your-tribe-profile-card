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

// Boot sequence klik event, als je op het Nintendo Switch 2 logo klikt
Switch2Logo.addEventListener('click', function () {
    if (isBooting || Switch2Logo.classList.contains('logo-unlock')) return;
    
    // Boolean gaat op true, hierdoor worden alle interacties geblokkeerd
    isBooting = true;

    // CSS selectors lezen
    let switchContainer = document.querySelector('.Switch2');
    let style = window.getComputedStyle(switchContainer);

    mainBlocks.forEach(block => block.classList.add('no-interaction'));
    settingsOptions.forEach(opt => opt.classList.add('no-interaction'));

    // Als er is geklikt op het logo, stop de floating animatie en reset hem terug naar de default position
    requestAnimationFrame(() => {
        switchContainer.classList.add('stop-animation');
        switchContainer.style.translate = '';
        switchContainer.style.rotate = '';
    });

    Switch2Screen.classList.remove('shadow');
    Switch2Logo.style.cursor = 'default';

    switchContainer.style.translate = style.translate;
    switchContainer.style.rotate = style.rotate;
    switchContainer.style.animation = 'none';

    // Animatie triggers, heel veel
    Switch2Logo.classList.add('logo-unlock');
    unlockScreen.classList.add('unlocked');
    // Erg cruciaal, deze class hieronder laat alle interacties werken als hij in #Switch2Console zit
    Switch2Console.classList.add('tablet-unlocked');
    Switch2All.style.animation = ''; 
    Switch2All.classList.add('tablet-unlocked-click');
    ScreenContent.classList.add('console-unlocked');
    
    // Joy cons bewegen naar het scherm
    document.querySelector('#Left-Joycon').classList.add('animate-click');
    document.querySelector('#Right-Joycon').classList.add('animate-click');
    setTimeout(() => {
        Switch2Console.classList.add('shadowLow');
        // Boot geluid speelt af na 400 milliseconden, dit is wanneer de joy cons het scherm aanraken
        if (initialSoundBuffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = initialSoundBuffer;
            source.connect(audioCtx.destination);
            source.start(0);
        }
    }, 400);

    // De boot sequence is klaar na ongeveer ~5.35 seconden, dan gaat de boolean op false en werken de interacties. Ook worden een aantal boot sequence classes verwijderd
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


// Als je op de power button klikt in de settings bar, dan sluit de console af en reset alles
powerButton.addEventListener('click', function (e) {
    if (isBooting) return;

    let switchContainer = document.querySelector('.Switch2');
    
    // Browser mag niets doen, JS doet het
    e.preventDefault();
    HomeIcon.classList.remove('home-active');
    HomeButton2.classList.remove('home-active');
    VCicon.classList.remove('vc-active');
    cButton.classList.remove('vc-active');

    // Reset terug naar dark mode
    removeLightMode()

    // Haal alle active selections weg op het home menu
    clearAllSelections()

    // Geen interactie met de objecten tijdens de reset
    mainBlocks.forEach(block => block.classList.add('no-interaction'));
    settingsOptions.forEach(opt => opt.classList.add('no-interaction'));

    // Float animatie speelt weer af
    switchContainer.classList.remove('stop-animation');

    // Joy con kleuren resetten weer naar default (offscreen)
    setTimeout(() => {
        resetJoyConColors()
        Switch2Screen.classList.add('shadow');
        Switch2Console.classList.remove('shadowLow');
        switchContainer.style.translate = '';
        switchContainer.style.rotate = '';
        switchContainer.style.animation = ''; 
    }, 1000);

    // Draai alle animaties om (reverse), ze spelen 5x zo snel andersom
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
        Switch2Console.classList.remove('tablet-unlocked');
        ScreenContent.classList.remove('console-unlocked');
        HomeButton2.classList.remove('home-active');
        Switch2Logo.classList.remove('logo-unlock');
    }, 100);
});

// Soundbuffer systeem voor audio, dit voorkomt latency en de geluiden spelen sneller af
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let initialSoundBuffer, blockSoundBuffer, settingsSoundBuffer, launchSoundBuffer, gamechatSoundBuffer, backSoundBuffer, homeSoundBuffer, fireGameSoundBuffer;
let nxonlineSoundBuffer, albumSoundBuffer, controllerSoundBuffer, eshopSoundBuffer, 
    gameshareSoundBuffer, newsSoundBuffer, powerSoundBuffer, settingsButtonSoundBuffer, cardsSoundBuffer;

// Paden naar alle geluiden
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
            fetch('snd/home.wav'),
            fetch('snd/fire_game.mp3')
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

const settingOptionsClick = document.querySelectorAll('.settings-options');

// Aparte geluiden voor elke optie in de settings bar met de panning, het pakt de buffers van net
settingOptionsClick.forEach(option => {
    option.addEventListener('click', async function () {
        if (isBooting || !Switch2Console.classList.contains('tablet-unlocked')) return;
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

// Speelt een geluid af als je op 1 van de 4 blokken klikt, ook weer met panning. forEach word gebruikt omdat er meerdere elementen zijn met de class
mainBlocks.forEach(block => {
    block.addEventListener('click', async function () {
        if (isBooting || !Switch2Console.classList.contains('tablet-unlocked')) return;

        if (this.classList.contains('no-interaction')) return;

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

// Speel hover sound alleen af als het blok actief is
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

// Speel hover sound alleen af als het blok actief is, maar dan voor de settings opties
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

// Alle selections van de items in het home menu worden weggehaald
function clearAllSelections() {
    borderBlocks.forEach(b => b.classList.remove('active-block'));
    const settingsBorders = document.querySelectorAll('.settings-border');
    settingsBorders.forEach(b => b.classList.remove('active-setting'));
}

// Interacties per optie, vaak is dat een kleine glow met aparte kleuren, maar de settings optie heeft een kleine rotatie voor het tandwiel
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

        // Verwijder animatie class als het volledig is afgespeeld
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

// Blokkeer alle interacties achter de overlay als hij is geopend
let isOverlayOpening = false;

function openGameOverlay(overlayElement, extraAction = null) {
    if (isOverlayOpening) return;
    
    isOverlayOpening = true;

    mainBlocks.forEach(block => block.classList.add('no-interaction'));
    settingsOptions.forEach(opt => opt.classList.add('no-interaction'));

    // Maakt hem actief en speelt een geluidje af uit de soundbuffer
    setTimeout(() => {
        overlayElement.classList.add('is-active');
        if (extraAction) extraAction();
        if (fireGameSoundBuffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = fireGameSoundBuffer;
            source.connect(audioCtx.destination);
            source.start(0);
        }
    }, 300);
}

// klik event voor de close (x) button in de overlays, dit haalt de active class weg en haalt de overlay weer weg
overlayCloseBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        AboutMeOverlay.classList.remove('is-active');
        FavGameOverlay.classList.remove('is-active');
        ExtraGamesOverlay.classList.remove('is-active');
        socialsOverlay.classList.remove('is-active');
        
        // De blokken & settings zijn weer interactible en een geluid word afgespeeld
        mainBlocks.forEach(block => block.classList.remove('no-interaction'));
        settingsOptions.forEach(opt => opt.classList.remove('no-interaction'));
        
        isOverlayOpening = false; 
        
        if (backSoundBuffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = backSoundBuffer;
            source.connect(audioCtx.destination);
            source.start(0);
        }

        // Pauzeert DK Bananza video en reset de begintijd weer terug naar 45 seconden
        const video = FavGameOverlay.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 45;
        }
    });
});

// Open de desbetreffende overlay als er op een bepaald blok is geklikt
// Dit werkt alleen als de dat blok de no-interaction class heeft. Deze word meegegeven in de openGameOverlay functie hierboven
AboutBlock.addEventListener('click', function () {
    if (this.classList.contains('no-interaction')) return;
    openGameOverlay(AboutMeOverlay);
});

Bananza.addEventListener('click', function () {
    if (this.classList.contains('no-interaction')) return;
    
    // DK Bananza video configuratie
    // Hij looped automatisch, maar video.muted moest er bij staan om het automatisch te laten afspelen met geluid.
    // Het volume is een beetje verlaagd zodat het niet te luid is
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

// Light/dark mode toggle als je op de home menu button klikt (rechter joy con)
// Ook speelt het weer een geluidje af als je er op klikt (inclusief time-out van 500ms)
HomeButton.addEventListener('click', function () {
    if (isBooting || !Switch2Console.classList.contains('tablet-unlocked') || isPlayingC) return;

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

// Light/dark mode functie die classes toevoegt aan elementen
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

// Light/dark mode verwijder functie die classes verwijdert van elementen
// Deze functie word aangeroepen als je op de power button klikt, dan reset alles weer naar dark mode (standaard)
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