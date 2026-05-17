export const SOUND_EFFECTS = [
    "among-us-role-reveal-sound.mp3",
    "anime-wow-sound-effect_mODx6ivQ.mp3",
    "confetti-pop-sound.mp3",
    "dj-airhorn-sound-effect_9Obpehx4.mp3",
    "dry-fart.mp3",
    "error_CDOxCYm.mp3",
    "fahhhhhhhhhhhhhh.mp3",
    "flash-bang-sfx_HYhVNJkR.mp3",
    "glass-breaking-sound-effect_wLZSIYn.mp3",
    "mac-quack.mp3",
    "metal-pipe-clang.mp3",
    "rizz-sound-effect.mp3",
    "screaming-goat.mp3",
    "vine-boom.mp3",
    "wow_8.mp3",
    "yeet-sound-effect_bxp7EWmH.mp3"
];

export const TIMINGS = {
    // Phase 1: 0% -> 90%
    stage1_forward: 15000,
    // Phase 2: 90% -> 1%
    stage2_reverseFull: 5000,
    // Phase 3: 1% -> 95%
    stage3_forward: 15000,
    // Phase 4: 95% -> 50%
    stage4_reverseHalf: 4000,
    // Phase 5: Draw flower from bar tip
    stage5_flowerDraw: 8000,
    // Phase 6: Bar 50% -> 85%
    stage6_finalForward: 6000,
    // Phase 7: Vertical drop line grows from 85% point downward
    stage7_lineDown: 1500,
    // Phase 9: 3-second pause before jumpscare
    pauseBeforeJumpscare: 3000,
    // Phase 9: Jumpscare fade-in
    jumpscareFadeIn: 1000,
    
    // Additional delays
    delayBeforeP2: 4000,
    delayBeforeP3: 2000,
    delayBeforeP4: 2000,
    delayBeforeP5: 4000,
    delayBeforeP7: 4000,

    barYFraction: 0.78,   // barY = window.innerHeight * this
    barThickness: 20,     // px — must match CSS height and SVG stroke-width

    // --- Flower draw config ---
    // Draw order: main stem → lower branch → left leaf → right leaf →
    //             bud → main body → petal cluster → shadow → highlight →
    //             drooping petal → falling petal (last)
    flowerDrawOrder: [9, 10, 7, 8, 4, 3, 0, 2, 1, 5, 6],
    flowerDrawPerPath: 565,   // ms per path stroke (scaled for ~8s total)
    flowerFillDelay: 180,     // ms for fill to fade after stroke
    flowerFallDuration: 1100, // ms for falling petal drop
};
