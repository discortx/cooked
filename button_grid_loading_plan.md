# Pre-Loading Button Grid Gateway Plan

## Overview
This feature replaces the single "Click to Load" button on the `#start-screen` with a chaotic, full-screen grid of buttons. The existing loading progress bar and wilted flower animation (on the `#loading-screen`) will remain fully intact and unmodified. 

When the user first loads the page, they are greeted by a screen completely filled with buttons. All but one button will play a random sound effect from the `Sound effects` folder when clicked. Exactly one button will trigger the start of the actual loading animation. To make it easier for presentation, this trigger button will always be randomly placed within the rightmost two columns of the grid on every page load. The background of the buttons will flash intensely between bright yellow and black to induce frustration and make it harder to focus.

## Implementation Details & Decisions
1. **Grid Dimensions (Auto-filling)**
   - The grid will dynamically fill the screen using CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))`). This ensures the screen is always completely packed with buttons regardless of the window size, without needing hardcoded rows or columns.
2. **Flashing Effect (Buttons Only)**
   - The `@keyframes flash` animation will be applied directly to the *background-color* of the buttons themselves. The buttons will alternate rapidly between `#FFFF00` (Bright Yellow) and `#000000` (Black).
3. **Sound Effect Distribution**
   - The script will read all 16 sound files from the `Sound effects` directory. Since there will likely be far more buttons than 16, the script will randomly select from this pool for each wrong button, meaning the sounds will repeat naturally across the grid.

## Initialization & Logic Flow
1. **Grid Generation (Page Load)**
   - Target the `#start-screen` container.
   - Clear its contents and generate `<button>` elements in a loop until the screen area is covered.
2. **Assigning the Trigger Button**
   - After the grid is populated, calculate which buttons fall into the rightmost two columns based on their index and the current CSS grid column count.
   - Randomly select one of these buttons to be the "Trigger Button".
   - Set an `onclick` event on the Trigger Button that hides `#start-screen` and reveals `#loading-screen`, kicking off the existing loading sequence.
3. **Assigning Audio Files to Wrong Buttons**
   - For all other buttons, attach an `onclick` event that selects a random audio file from the 16 available and plays it via the HTML5 Audio API.

## Files to Update
- **`index.html`**: 
  - Modify the `#start-screen` `div`. Remove the single `#start-btn` and prepare the container for the button grid.
  - The `#loading-screen` remains completely unchanged.
- **`css/loader.css`**: 
  - Add the CSS Grid layout for `#start-screen` (`display: grid; gap: 5px; height: 100vh; width: 100vw;`).
  - Add the flashing `@keyframes` animation for the buttons inside the grid.
  - Style the buttons to look identical (no borders, rapid flashing) so the user cannot guess which one is the trigger.
- **`js/config.js`**: 
  - Add an array constant containing the filenames of the 16 sound effects.
- **`js/animations.js` or `js/main.js`**: 
  - Add the logic to dynamically generate the button grid on load.
  - Add the logic to assign the trigger button, map the sound effects, and handle click events.
  - Ensure the transition logic to `#loading-screen` works seamlessly when the trigger button is pressed.
