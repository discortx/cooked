import { TIMINGS } from './config.js';

export class Animations {
    constructor() {
        this.progressPath  = document.getElementById('progress-path');
        this.dropPath      = document.getElementById('drop-path');
        this.video         = document.getElementById('jumpscare-video');
        this.wiltedFlower  = document.getElementById('wilted-flower');
        this.cornerDot     = document.getElementById('corner-dot');

        // Cached actual rendered pixel lengths — computed once on first use
        this._progressLen  = null;
    }

    // ─── Internal: compute and cache path lengths, hide bar fully ────────────

    _initPaths() {
        const pLen = this.progressPath.getTotalLength(); // actual length in user units
        this._progressLen = pLen;
        // Start fully hidden
        this.progressPath.style.strokeDasharray  = pLen;
        this.progressPath.style.strokeDashoffset = pLen;
        this.progressPath.style.transition       = 'none';
    }

    // ─── Progress bar helpers ────────────────────────────────────────────────

    /**
     * Animate the progress bar to `percent` over `duration` ms.
     * All values are actual rendered pixels from getTotalLength().
     */
    setProgress(percent, duration) {
        if (!this._progressLen) this._initPaths();
        const len          = this._progressLen;
        const targetOffset = len * (1 - percent / 100);

        this.progressPath.style.transition       = 'none';
        void this.progressPath.offsetWidth;                                // flush
        this.progressPath.style.transition       = `stroke-dashoffset ${duration}ms linear`;
        this.progressPath.style.strokeDashoffset = targetOffset;
    }

    hideProgressBar() {
        // No-op — bar is hidden by dashoffset; JS controls it entirely
    }

    /**
     * Snap the bar to 50% with no animation (used after flower draw-in).
     */
    showProgressBar() {
        if (!this._progressLen) this._initPaths();
        this.progressPath.style.transition       = 'none';
        this.progressPath.style.strokeDashoffset = (this._progressLen * 0.5);
        void this.progressPath.offsetWidth;                                // flush
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
        const el      = this.wiltedFlower;
        const ORDER   = TIMINGS.flowerDrawOrder;
        const PER     = TIMINGS.flowerDrawPerPath;
        const FILL_MS = TIMINGS.flowerFillDelay;
        const FALL_MS = TIMINGS.flowerFallDuration;

        // Make flower container invisible while we measure
        el.style.opacity = '0';
        void el.getBoundingClientRect(); // force layout so paths can be measured

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
        void el.getBoundingClientRect();
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity    = '1';

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
        this.showProgressBar();
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
        const len = dp.getTotalLength();   // actual length in user units
        const dur = TIMINGS.stage7_lineDown;

        dp.style.opacity          = '1';   // unhide (CSS starts it at 0)
        dp.style.strokeDasharray  = len;
        dp.style.strokeDashoffset = len;
        dp.style.transition       = 'none';
        void dp.offsetWidth;               // flush

        dp.style.transition       = `stroke-dashoffset ${dur}ms linear`;
        dp.style.strokeDashoffset = '0';

        if (this.cornerDot) {
            this.cornerDot.style.transition = 'opacity 0.2s linear';
            this.cornerDot.style.opacity    = '1';
        }

        setTimeout(() => { if (onComplete) onComplete(); }, dur);
    }

    // ─── Slide flower to bottom ───────────────────────────────────────────────

    slideFlowerToBottom(onComplete) {
        const el  = this.wiltedFlower;
        const dur = TIMINGS.stage8_slideDown || 1500;

        el.style.transition = `transform ${dur}ms ease-in`;
        el.style.transform  = 'translateY(1100px)';

        setTimeout(() => { if (onComplete) onComplete(); }, dur);
    }

    // ─── Jumpscare ───────────────────────────────────────────────────────────

    playJumpscare(onEndCallback) {
        this.video.currentTime = 0;
        this.video.volume = 1.0;
        this.video.muted  = false;
        this.video.play().catch(e => console.error('Jumpscare play failed:', e));

        this.video.style.transition    = `opacity ${TIMINGS.jumpscareFadeIn}ms linear`;
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
