# Loading Page — Animation Plan

## Overview

A deliberately awful loading experience. The progress bar teases the user, transforms into a wilted
flower that sprouts from the bar itself, then the bar's line turns 90° downward, dragging the flower
to the bottom of the screen before a jumpscare video fires.

---

## Phase Sequence

### Phase 1 — False Hope (0% → 90%)
- Progress bar animates from 0% to **90%** of screen width.
- Duration: **15 s**

### Phase 2 — Cruel Reversal (90% → 1%)
- Bar retreats all the way back to **1%** (almost fully gone).
- Duration: **5 s**
- **Delay:** 2-second pause before Phase 3 begins.

### Phase 3 — Second Attempt (1% → 95%)
- Bar marches forward again, reaching **95%** this time — SO close.
- Duration: **15 s**

### Phase 4 — Tease Pull-back to 50% (95% → 50%)
- Bar retreats to the **50% mark** (exact horizontal center of screen).
- Duration: **4 s**
- **Delay:** 2-second pause before Phase 5 begins.

### Phase 5 — Flower Sprouts from the Bar
- Duration: **8 s**

This is the core visual effect.
- At 50%, the bar tip is sitting at the center of the screen horizontally.
- The flower SVG is positioned so its bottom aligns with the bar line.
- The stem paths have been manually re-ordered in HTML so the draw animation correctly grows **outward and upward** from the base.
- Draw order (bottom to top, falling petal last):
  1. fp-9 — main stem
  2. fp-10 — lower stem branch
  3. fp-7 — left leaf
  4. fp-8 — right leaf
  5. fp-4 — green bud at stem tip
  6. fp-3 — main flower head body
  7. fp-0 — petal cluster top
  8. fp-2 — petal shadow
  9. fp-1 — petal highlight
  10. fp-5 — right drooping petal
  11. fp-6 — falling petal (drawn last, then falls with gravity)

#### Colors
- **Entire Flower:** `#000000` (Pure Black). Every single path of the flower is identical in color to the progress bar to make it look like the bar physically morphed into the flower.

### Phase 6 — Flower Stays, Bar Continues (50% → 85%)
- Flower stays on screen perfectly anchored at 50%.
- Progress bar advances to 85%.
- Duration: **6 s**
- **Delay:** 2-second pause before the line drops.

### Phase 7 — Line Changes Direction at 85%
- Duration: **1.5 s**
- At 85% the horizontal bar stays frozen.
- A vertical segment (#drop-path) grows downward from that exact 85% point past the bottom of the screen.

### Phase 8 — Pause
- **3-second pause** while the user stares at the completed screen.
*(Note: the original plan to slide the flower downward alongside the drop line has been scrapped; the flower remains fixed at 50%.)*

### Phase 9 — Jumpscare
- The jumpscare video fades in at full volume.
- On video end → redirect to chaos-login.html.

---

## Files to Change
- index.html — add #drop-path element; update flower fill colors to yellow
- css/loader.css — move bar lower; flower positioning; drop-path styles
- js/config.js — new timings, color palette
- js/animations.js — drawFlower() with new colors; turnLineDown(); slideFlowerToBottom()
- js/stateMachine.js — 9-phase flow

---

## Open Questions — Please Confirm

Q1 — Stem color
I assumed the stem matches the progress bar color (black / #1a1a1a) so it looks like
the bar is morphing into the stem. Is this correct?

Q2 — Line turning downward
My plan: horizontal bar stays frozen at 85%, a new vertical segment grows downward from
that 85% point. Is this right, or should the horizontal bar also retract as the vertical
segment grows?

Q3 — Flower movement during the downward line
Should the flower slide down alongside the growing vertical line (looks like it's being
pulled down), or should it wait for the line to reach the bottom and then independently
slide down?

Q4 — Flower position at the bottom edge
When the flower arrives at the bottom, does it:
(a) Stop fully visible at the bottom edge
(b) Stop partially off-screen (only top portion visible)
(c) Fully disappear off-screen
After 3 seconds, jumpscare fires.
