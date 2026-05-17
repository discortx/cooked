import { TIMINGS } from './config.js';

export class Animations {
    constructor() {
        this.barDiv          = document.getElementById('progress-bar');
        this.flowerContainer = document.getElementById('flower-container');
        this.progressSvg     = document.getElementById('progress-svg');
        this.dropPath        = document.getElementById('drop-path');
        this.video           = document.getElementById('jumpscare-video');
        this.wiltedFlower    = document.getElementById('wilted-flower');
        this.cornerDot       = document.getElementById('corner-dot');

        this.updateGeometry = this.updateGeometry.bind(this);
        this.updateGeometry();
        window.addEventListener('resize', this.updateGeometry);
    }

    updateGeometry() {
        this.W    = window.innerWidth;
        this.H    = window.innerHeight;
        this.barY = Math.round(this.H * TIMINGS.barYFraction);

        this.progressSvg.setAttribute('viewBox', `0 0 ${this.W} ${this.H}`);

        const x85 = Math.round(this.W * 0.85);
        this.dropPath.setAttribute('d', `M ${x85} ${this.barY} L ${x85} ${this.H + 300}`);

        if (this.cornerDot) {
            this.cornerDot.setAttribute('cx', x85);
            this.cornerDot.setAttribute('cy', this.barY);
        }
    }

    // ─── Progress bar helpers ────────────────────────────────────────────────

    setProgress(percent, duration) {
        void this.barDiv.offsetWidth; // flush layout to ensure transition runs
        this.barDiv.style.transition = `width ${duration}ms linear`;
        this.barDiv.style.width      = `${percent}%`;
    }

    /**
     * Snap the bar to 50% with no animation (used after flower draw-in).
     */
    showProgressBar() {
        this.barDiv.style.transition = 'none';
        this.barDiv.style.width      = '50%';
        // Force reflow then allow transitions again:
        void this.barDiv.offsetWidth;
    }

    // ─── Flower draw-in ──────────────────────────────────────────────────────

    /**
     * Draws the wilted flower path-by-path using stroke-dashoffset.
     *
     * Key fix: dasharray/dashoffset are set via setAttribute() (always SVG user
     * units) rather than element.style (which treats unitless numbers as CSS px,
     * causing the ~4× scale mismatch that deformed the flower).
     *
     * fp-9 (main stem, ORDER index 0): its <path d="..."> has been reversed in
     * HTML so it starts at the stem base. Positive dashoffset (len→0) therefore
     * draws base→tip (upward), matching the "growing from bar tip" goal.
     *
     * All other paths: positive dashoffset draws start→end (natural direction).
     *
     * @param {Function} onComplete  called after the falling petal finishes
     */
    drawFlower(onComplete) {
        // 1. Compute flower position from bar tip at 50 %
        const tipX   = Math.round(this.W * 0.50);           // bar tip pixel X
        const tipY   = this.barY;                            // bar Y pixel

        // 2. The flower SVG internal stem base is at svg-local (56, 122)
        //    in a 128×128 viewBox rendered at 350×350 px
        //    → stemBaseX_local = (56/128) * 350 = 153.125 px from left of container
        //    → stemBaseY_local = (122/128) * 350 = 333.6 px from top of container
        const stemLocalX = (56 / 128) * 350;    // ≈ 153.1
        const stemLocalY = (122 / 128) * 350;   // ≈ 333.6

        // 3. Position container so stem base sits on bar tip
        this.flowerContainer.style.left = `${tipX - stemLocalX}px`;
        this.flowerContainer.style.top  = `${tipY - stemLocalY}px`;

        const el      = this.wiltedFlower;
        const ORDER   = TIMINGS.flowerDrawOrder;
        const PER     = TIMINGS.flowerDrawPerPath;
        const FILL_MS = TIMINGS.flowerFillDelay;
        const FALL_MS = TIMINGS.flowerFallDuration;

        // Make flower container invisible while we measure
        this.flowerContainer.style.opacity = '0';
        void this.flowerContainer.getBoundingClientRect(); // force layout so paths can be measured

        const paths = Array.from(el.querySelectorAll('path'));

        // Initialise every path: invisible fill, stroke = its fill color, full dashoffset
        paths.forEach(p => {
            const len      = p.getTotalLength();
            const origFill = p.getAttribute('fill');
            p.dataset.origFill    = origFill;
            p.dataset.totalLength = String(len);
            p.style.fill          = 'transparent';
            p.style.stroke        = origFill;
            p.style.strokeWidth   = '1.5';
            // Use setAttribute so values are SVG user units, not CSS px
            p.setAttribute('stroke-dasharray', len);
            p.setAttribute('stroke-dashoffset', len); // positive: draws start→end
            p.style.transition    = 'none';
            p.style.opacity       = '1';
        });

        // Fade in the flower container
        void this.flowerContainer.getBoundingClientRect();
        this.flowerContainer.style.transition = 'opacity 0.4s ease';
        this.flowerContainer.style.opacity    = '1';

        // Animate each path in draw order
        ORDER.forEach((pathIdx, i) => {
            const p      = paths[pathIdx];
            const isLast = (i === ORDER.length - 1);
            const tStroke = i * PER;
            const tFill   = tStroke + PER;

            // 1. Stroke draws in (via CSS transition on style, targeting the SVG attr value)
            setTimeout(() => {
                p.style.transition       = `stroke-dashoffset ${PER}ms linear`;
                p.style.strokeDashoffset = '0';   // animate to 0
            }, tStroke);

            // 2. Fill fades in, stroke fades out
            setTimeout(() => {
                p.style.transition    = `fill ${FILL_MS}ms ease-in, stroke-opacity ${FILL_MS}ms ease-out`;
                p.style.fill          = p.dataset.origFill;
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
        this.barDiv.style.transition = 'none';
        this.barDiv.style.width      = '50%';
        void this.barDiv.offsetWidth;   // flush
    }

    // ─── Turn line downward at 85% point ─────────────────────────────────────

    /**
     * Grows the vertical #drop-path downward from (850,900) using stroke-dashoffset.
     * Uses getTotalLength() for actual rendered pixel length — fixes the same
     * px/unit mismatch that affected the progress bar.
     * @param {Function} onComplete  called when the drop segment is fully drawn
     */
    turnLineDown(onComplete) {
        const dp  = this.dropPath;
        const len = dp.getTotalLength();   // now returns real pixel length
        const dur = TIMINGS.stage7_lineDown;

        dp.setAttribute('stroke-dasharray',  len);
        dp.setAttribute('stroke-dashoffset', len);
        dp.style.opacity = '1';

        // Force reflow
        void dp.getBoundingClientRect();

        dp.style.transition       = `stroke-dashoffset ${dur}ms linear`;
        dp.style.strokeDashoffset = '0';

        if (this.cornerDot) {
            this.cornerDot.style.transition = 'opacity 0.2s linear';
            this.cornerDot.style.opacity    = '1';
        }

        setTimeout(() => { if (onComplete) onComplete(); }, dur);
    }

    // ─── Jumpscare ───────────────────────────────────────────────────────────

    playJumpscare(onEndCallback) {
        this.video.currentTime = 0;
        this.video.volume = 1.0;
        this.video.muted  = false;
        this.video.play().catch(e => console.error('Jumpscare play failed:', e));

        this.video.style.transition    = `opacity ${TIMINGS.jumpscareFadeIn}ms ease-in`;
        this.video.style.opacity       = '1';
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
