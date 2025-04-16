document.addEventListener('DOMContentLoaded', () => {
    const entryScreen = document.getElementById('entry-screen');
    const mainContent = document.getElementById('main-content');
    const backgroundMusic = document.getElementById('background-music');
    const customCursor = document.getElementById('custom-cursor');
    const cursorBefore = getComputedStyle(customCursor, '::before'); // Needed if pseudo-elements have background
    const cursorAfter = getComputedStyle(customCursor, '::after'); // Needed if pseudo-elements have background


    // --- Entry Screen Logic ---
    entryScreen.addEventListener('click', () => {
        entryScreen.classList.add('hidden'); // Start fade out CSS transition

        // Wait for fade out before hiding completely and showing content
        setTimeout(() => {
            entryScreen.style.display = 'none'; // Hide completely
            mainContent.classList.add('visible'); // Start fade in CSS transition

            // Attempt to play music (might be blocked by browser until user interaction)
            backgroundMusic.play().catch(error => {
                console.log("Music playback failed:", error);
                // Optionally, show a message or a play button if autoplay fails
            });
        }, 500); // Match CSS transition duration
    }, { once: true }); // Only allow clicking once

    // --- Custom Cursor Logic ---
    document.addEventListener('mousemove', (e) => {
        // Update custom cursor position
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;

        // Create a trail dot
        createTrailDot(e.clientX, e.clientY);
    });

    function createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        // Apply current cursor color - This is tricky because the color is animated via CSS.
        // We can approximate or just let the trail dot's own animation handle colors.
        // dot.style.backgroundColor = getComputedStyle(customCursor).backgroundColor; // Might grab intermediate colors

        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;

        document.body.appendChild(dot);

        // Remove the dot after animation duration (0.8 seconds)
        setTimeout(() => {
            dot.remove();
        }, 800); // 800 milliseconds = 0.8 seconds
    }

    // Small adjustment for heart shape via pseudo-elements - might need tweaking
    // The CSS above attempts a heart shape using rotation and ::before/::after
    // Ensure the background color animation applies correctly to these elements
    // Update: Applied animation directly to pseudo-elements in CSS.

});
