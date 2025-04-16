document.addEventListener('DOMContentLoaded', () => {
    // Select necessary elements from the DOM
    const entryScreen = document.getElementById('entry-screen');
    const mainContent = document.getElementById('main-content');
    const backgroundMusic = document.getElementById('background-music');
    const customCursor = document.getElementById('custom-cursor');

    // --- Entry Screen Logic ---
    entryScreen.addEventListener('click', () => {
        // Start fading out the entry screen
        entryScreen.classList.add('hidden');

        // After the fade-out animation completes (500ms), hide it and show main content
        setTimeout(() => {
            entryScreen.style.display = 'none'; // Hide completely for performance
            mainContent.classList.add('visible'); // Start fading in main content

            // Attempt to play background music (may require user interaction)
            backgroundMusic.play().catch(error => {
                console.warn("Background music autoplay failed. Browser policy likely requires direct user interaction first.", error);
                // Optionally: Show a manual play button if autoplay fails.
            });
        }, 500); // Duration should match the CSS transition duration for #entry-screen opacity
    }, { once: true }); // Ensure the click only triggers this once

    // --- Custom Cursor Tracking and Trail ---
    document.addEventListener('mousemove', (e) => {
        // Update custom cursor position to follow the mouse
        // Use clientX/clientY for viewport-relative coordinates
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;

        // Create a trail dot at the current mouse position
        createTrailDot(e.clientX, e.clientY);
    });

    // Function to create and manage trail dots
    function createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');

        // Set the dot's position
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;

        // Append the dot to the body
        document.body.appendChild(dot);

        // Remove the dot after its fade-out animation completes (0.8 seconds)
        setTimeout(() => {
            dot.remove();
        }, 800); // 800 milliseconds = 0.8 seconds (match CSS fade-out duration)
    }
});
