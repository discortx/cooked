import { TIMINGS } from './config.js';
import { Animations } from './animations.js';

export class StateMachine {
    constructor() {
        this.anim = new Animations();
    }

    start() {
        // Phase 1: 0% → 90% — build false hope
        console.log('[P1] 0% → 90%');
        this.anim.setProgress(90, TIMINGS.stage1_forward);
        setTimeout(() => this.phase2(), TIMINGS.stage1_forward + TIMINGS.delayBeforeP2);
    }

    phase2() {
        // Phase 2: 90% → 1% — cruel reversal
        console.log('[P2] 90% → 1%');
        this.anim.setProgress(1, TIMINGS.stage2_reverseFull);
        setTimeout(() => this.phase3(), TIMINGS.stage2_reverseFull + TIMINGS.delayBeforeP3);
    }

    phase3() {
        // Phase 3: 1% → 95% — almost there!
        console.log('[P3] 1% → 95%');
        this.anim.setProgress(95, TIMINGS.stage3_forward);
        setTimeout(() => this.phase4(), TIMINGS.stage3_forward + TIMINGS.delayBeforeP4);
    }

    phase4() {
        // Phase 4: 95% → 50% — pull back to flower spawn point
        console.log('[P4] 95% → 50%');
        this.anim.setProgress(50, TIMINGS.stage4_reverseHalf);
        setTimeout(() => this.phase5(), TIMINGS.stage4_reverseHalf + TIMINGS.delayBeforeP5);
    }

    phase5() {
        // Phase 5: Draw flower sprouting from the 50% bar tip (bar stays visible!)
        console.log('[P5] Drawing flower...');
        this.anim.drawFlower(() => this.phase6());
    }

    phase6() {
        // Phase 6: Flower stays centered; bar reappears at 50% and marches to 85%
        console.log('[P6] Bar 50% → 85%');
        this.anim.continueAfterFlower();
        setTimeout(() => {
            this.anim.setProgress(85, TIMINGS.stage6_finalForward);
        }, 200);
        // After bar reaches 85%, pause before turning the line downward
        setTimeout(() => this.phase7(), 200 + TIMINGS.stage6_finalForward + TIMINGS.delayBeforeP7);
    }

    phase7() {
        // Phase 7: Vertical drop line grows from 85% point — L-shape forms
        console.log('[P7] Line turns down');
        this.anim.turnLineDown(() => {
            setTimeout(() => this.phase9(), TIMINGS.pauseBeforeJumpscare);
        });
    }

    phase9() {
        // Phase 9: Jumpscare
        console.log('[P9] Jumpscare!');
        this.anim.playJumpscare(() => this.end());
    }

    end() {
        console.log('[END] Redirect');
        window.location.href = 'chaos-login.html';
    }
}
