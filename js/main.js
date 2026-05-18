// Created by SilkSong
import { StateMachine } from './stateMachine.js';
import { SOUND_EFFECTS } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const video = document.getElementById('jumpscare-video');

    startScreen.innerHTML = ''; // clear any existing content

    // Preload audio files so they trigger instantly
    const preloadedAudio = SOUND_EFFECTS.map(file => {
        const audio = new Audio(`Sound effects/${file}`);
        audio.preload = 'auto';
        return audio;
    });

    const colWidth = 120;
    const gap = 5;
    const rowHeight = 60;
    
    // We add extra rows just to ensure we cover the screen fully
    const cols = Math.max(2, Math.floor((window.innerWidth + gap) / (colWidth + gap)));
    const rows = Math.max(1, Math.floor((window.innerHeight + gap) / (rowHeight + gap))) + 2; 
    
    const totalButtons = cols * rows;

    const buttons = [];
    for (let i = 0; i < totalButtons; i++) {
        const btn = document.createElement('button');
        btn.className = 'grid-btn';
        startScreen.appendChild(btn);
        buttons.push({ element: btn, index: i });
    }

    const rightMostButtons = buttons.filter(b => {
        const colIndex = b.index % cols;
        return colIndex >= cols - 2;
    });

    const triggerBtnObj = rightMostButtons[Math.floor(Math.random() * rightMostButtons.length)];
    const triggerBtn = triggerBtnObj ? triggerBtnObj.element : buttons[0].element;

    // Assets to silently preload while progress bar runs
    const ASSETS_TO_PRELOAD = [
        "Videos/mission passed GTA sa.mp4",
        "Videos/chutti kar.mp4",
        "imgs/1.png", "imgs/2 1.png", "imgs/4 1.png", "imgs/5 1.png", "imgs/6 1.png", "imgs/7 1.png", "imgs/8.png",
        "signup.html",
        "login.html",
        "inside.html"
    ];

    const preloadOtherAssets = () => {
        ASSETS_TO_PRELOAD.forEach(src => {
            if (src.endsWith('.mp4')) {
                const v = document.createElement('video');
                v.preload = 'auto';
                v.src = src;
            } else if (src.endsWith('.png') || src.endsWith('.jpg')) {
                const img = new Image();
                img.src = src;
            } else {
                fetch(src).catch(() => {});
            }
        });
    };

    const startLoadingSequence = () => {
        video.load();
        video.play().then(() => {
            video.pause();
        }).catch(e => {
            console.log("Autoplay policy might still block it: ", e);
        });

        // Fire off background preload of all next-page assets
        preloadOtherAssets();

        startScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');

        const stateMachine = new StateMachine();
        stateMachine.start();
    };

    buttons.forEach(b => {
        const btn = b.element;
        if (btn === triggerBtn) {
            btn.addEventListener('click', startLoadingSequence);
        } else {
            btn.addEventListener('click', () => {
                const originalAudio = preloadedAudio[Math.floor(Math.random() * preloadedAudio.length)];
                const audioClone = originalAudio.cloneNode();
                audioClone.volume = 0.7;
                audioClone.play().catch(e => console.error(e));
            });
        }
    });
});
