import { TIMINGS } from './config.js';

export class Animations {
    constructor() {
        this.progressPath  = document.getElementById('progress-path');
        this.dropPath      = document.getElementById('drop-path');
        this.video         = document.getElementById('jumpscare-video');
        this.wiltedFlower  = document.getElementById('wilted-flower');
        this.cornerDot     = document.getElementById('corner-dot');
    }

    // ─── Progress bar helpers ────────────────────────────────────────────────

    setProgress(percent, duration) {
        const current = window.getComputedStyle(this.progressPath).strokeDashoffset;
        this.progressPath.style.transition = 'none';
        this.progressPath.style.strokeDashoffset = current;
        void this.progressPath.offsetWidth;
        this.progressPath.style.transition = `stroke-dashoffset ${duration}ms linear, opacity 1s linear`;
        this.progressPath.style.strokeDashoffset = (100 - percent) * 10;
    }

    hideProgressBar() {
    }

    showProgressBar() {
        // Snap to 50% with no animation
        this.progressPath.style.transition = 'none';
        this.progressPath.style.strokeDashoffset = '500';
        void this.progressPath.offsetWidth;
    }

    // ─── Flower draw-in ──────────────────────────────────────────────────────

    /**
     * Draws the wilted flower path-by-path using stroke-dashoffset.
     * Colors are read from each path's `fill` HTML attribute — change the HTML to change colors.
     * The last path (fp-6, falling petal) drops off after being drawn.
     * @param {Function} onComplete  called after the falling petal finishes
     */
    drawFlower(onComplete) {
        const el          = this.wiltedFlower;
        const ORDER       = TIMINGS.flowerDrawOrder;
        const PER         = TIMINGS.flowerDrawPerPath;
        const FILL_MS     = TIMINGS.flowerFillDelay;
        const FALL_MS     = TIMINGS.flowerFallDuration;

        // The flower is now an SVG element (not a div) — just make it visible
        el.style.opacity = '0';
        void el.getBoundingClientRect(); // force layout so paths can be measured

        const paths = Array.from(el.querySelectorAll('path'));

        // Initialise every path: invisible fill, stroke = its fill color, full dashoffset
        paths.forEach(p => {
            const len      = p.getTotalLength();
            const origFill = p.getAttribute('fill');
            p.dataset.origFill     = origFill;
            p.dataset.totalLength  = String(len);
            p.style.fill           = 'transparent';
            p.style.stroke         = origFill;
            p.style.strokeWidth    = '1.5';
            p.style.strokeDasharray  = String(len);
            p.style.strokeDashoffset = String(-len);
            p.style.transition     = 'none';
            p.style.opacity        = '1';
        });

        // Fade in the flower container
        void el.getBoundingClientRect();
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity    = '1';

        // Animate each path in draw order
        ORDER.forEach((pathIdx, i) => {
            const p      = paths[pathIdx];
            const isLast = (i === ORDER.length - 1);
            const tStroke = i * PER;
            const tFill   = tStroke + PER;

            // 1. Stroke draws in
            setTimeout(() => {
                p.style.transition       = `stroke-dashoffset ${PER}ms linear`;
                p.style.strokeDashoffset = '0';
            }, tStroke);

            // 2. Fill fades in, stroke fades out
            setTimeout(() => {
                p.style.transition   = `fill ${FILL_MS}ms ease-in, stroke-opacity ${FILL_MS}ms ease-out`;
                p.style.fill         = p.dataset.origFill;
                p.style.strokeOpacity = '0';

                // 3. Last petal falls, then call onComplete
                if (isLast) {
                    setTimeout(() => {
                        p.style.transformBox    = 'fill-box';
                        p.style.transformOrigin = 'top center';
                        p.style.transition      = `transform ${FALL_MS}ms cubic-bezier(0.4,0,1,1), opacity ${FALL_MS * 0.8}ms ease-in`;
                        p.style.transform       = 'translateY(60px) rotate(30deg)';
                        p.style.opacity         = '0';
                        setTimeout(() => { if (onComplete) onComplete(); }, FALL_MS + 100);
                    }, FILL_MS + 400);
                }
            }, tFill);
        });
    }

    // ─── Post-flower: re-show bar and continue ───────────────────────────────

    continueAfterFlower() {
        this.showProgressBar();
    }

    // ─── Turn line downward at 85% point ─────────────────────────────────────

    /**
     * Grows the vertical #drop-path downward from (850,800) using stroke-dashoffset.
     * The L-shape then stays on screen permanently until jumpscare.
     * @param {Function} onComplete  called when the drop segment is fully drawn
     */
    turnLineDown(onComplete) {
        const dp  = this.dropPath;
        const len = TIMINGS.dropLength;
        const dur = TIMINGS.stage7_lineDown;

        dp.style.transition       = 'none';
        dp.style.strokeDashoffset = String(len);
        void dp.offsetWidth;

        dp.style.transition       = `stroke-dashoffset ${dur}ms linear`;
        dp.style.strokeDashoffset = '0';

        if (this.cornerDot) {
            this.cornerDot.style.transition = 'opacity 0.2s linear';
            this.cornerDot.style.opacity = '1';
        }

        setTimeout(() => { if (onComplete) onComplete(); }, dur);
    }

    slideFlowerToBottom(onComplete) {
        const el = this.wiltedFlower;
        const dur = TIMINGS.pauseBeforeJumpscare || 3000;
        
        el.style.transition = `transform ${dur}ms ease-in`;
        el.style.transform = 'translateY(1100px)';
        
        setTimeout(() => { if (onComplete) onComplete(); }, dur);
    }

    // ─── Jumpscare ───────────────────────────────────────────────────────────

    playJumpscare(onEndCallback) {
        this.video.volume = 1.0;
        this.video.muted  = true;
        this.video.play().catch(e => console.error('Jumpscare play failed:', e));
        setTimeout(() => { this.video.muted = false; }, 1000);

        this.video.style.transition   = `opacity ${TIMINGS.jumpscareFadeIn}ms linear`;
        this.video.style.opacity      = '1';
        this.video.style.pointerEvents = 'auto';

        let fired = false;
        const finish = () => {
            if (!fired) { fired = true; if (onEndCallback) onEndCallback(); }
        };

        this.video.addEventListener('timeupdate', () => {
            if (this.video.duration && this.video.currentTime >= this.video.duration - 1) {
                this.video.pause();
                finish();
            }
        });
        setTimeout(finish, 20000); // safety fallback
    }
}
