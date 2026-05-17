# Loading Page — Animation Plan

## Overview

A deliberately awful loading experience. The progress bar teases the user, transforms into a wilted
flower that sprouts from the bar itself, then the bar's line turns 90° downward, dragging the flower
to the bottom of the screen before a jumpscare video fires.

---

## Phase Sequence

### Phase 1 — False Hope (0% → 90%)
- Progress bar animates from 0% to **90%** of screen width.
- Speed: moderately fast (~8 s) so the user thinks they're nearly there.

### Phase 2 — Cruel Reversal (90% → 1%)
- Bar retreats all the way back to **1%** (almost fully gone).
- Speed: faster than phase 1 (~3 s) — sudden, demoralizing.

### Phase 3 — Second Attempt (1% → 95%)
- Bar marches forward again, reaching **95%** this time — SO close.
- Speed: similar to phase 1 (~7 s).

### Phase 4 — Tease Pull-back to 50% (95% → 50%)
- Bar retreats to the **50% mark** (exact horizontal center of screen).
- Speed: medium (~2.5 s).

### Phase 5 — Flower Sprouts from the Bar (~7 s total)

This is the core visual effect.

#### Setup
- At 50%, the bar tip is sitting at the center of the screen horizontally,
  on the progress bar Y position (lower third of screen).
- The flower SVG is positioned so its bottom aligns with the bar line.
  The stem appears to grow upward directly out of the tip of the bar.

#### Draw-in Animation (stroke-dashoffset technique)
Draw order (bottom to top, falling petal last):
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

#### Colors (CHANGED from original SVG)
Stem (fp-9, fp-10, fp-7, fp-8, fp-4): #1a1a1a — same black as the progress bar
Petals (yellow palette):
- fp-3 (main body):        #d4a017  dark gold
- fp-0 (petal cluster):    #e8b84b  warm yellow
- fp-2 (shadow petal):     #b8860b  dark goldenrod
- fp-1 (highlight petal):  #f5d060  light yellow
- fp-5 (drooping petal):   #c9960c  amber
- fp-6 (falling petal):    #f0c040  golden yellow

### Phase 6 — Flower Stays, Bar Continues (50% → 85%)
- Flower stays on screen.
- Progress bar reappears at 50% and advances to 85%.
- Duration: ~4 s.

### Phase 7 — Line Changes Direction at 85%
At 85% the SVG path bends downward. The horizontal bar stays frozen at 85%,
and a NEW vertical segment (#drop-path) grows downward from that exact 85% point
toward and past the bottom of the screen. This is done by animating a second
SVG path using stroke-dashoffset (same technique as the flower draw-in).

### Phase 8 — Flower Slides to Bottom Edge
The wilted flower div CSS-transforms downward alongside the growing vertical line,
arriving at the bottom of the viewport. It stays there.
Duration: ~1.5 s.

### Phase 9 — 3-Second Pause, then Jumpscare
After the flower arrives at the bottom, a 3-second pause.
Then the jumpscare video fades in at full volume.
On video end → redirect to chaos-login.html.

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
