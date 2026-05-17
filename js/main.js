// Created by SilkSong
import { StateMachine } from './stateMachine.js';
import { SOUND_EFFECTS } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const video = document.getElementById('jumpscare-video');

    startScreen.innerHTML = ''; // clear any existing content

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

    const startLoadingSequence = () => {
        video.load();
        video.play().then(() => {
            video.pause();
        }).catch(e => {
            console.log("Autoplay policy might still block it: ", e);
        });

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
            const soundFile = SOUND_EFFECTS[Math.floor(Math.random() * SOUND_EFFECTS.length)];
            const audio = new Audio(`Sound effects/${soundFile}`);
            audio.volume = 0.7;
            btn.addEventListener('click', () => {
                audio.currentTime = 0;
                audio.play().catch(e => console.error(e));
            });
        }
    });
});
