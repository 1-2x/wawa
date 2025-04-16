document.addEventListener('DOMContentLoaded', () => {
    // Select necessary elements
    const entryScreen = document.getElementById('entry-screen');
    const mainContent = document.getElementById('main-content');
    const backgroundMusic = document.getElementById('background-music');
    const customCursor = document.getElementById('custom-cursor');
    const iconLinks = document.querySelectorAll('.icon-link'); // Select all icon links

    // --- Entry Screen Logic ---
    entryScreen.addEventListener('click', () => {
        entryScreen.classList.add('hidden');
        setTimeout(() => {
            entryScreen.style.display = 'none';
            mainContent.classList.add('visible');
            backgroundMusic.play().catch(error => {
                console.warn("Background music autoplay failed.", error);
            });
        }, 500);
    }, { once: true });

    // --- Custom Cursor Tracking and Trail ---
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
        createTrailDot(e.clientX, e.clientY);
    });

    function createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        document.body.appendChild(dot);
        setTimeout(() => {
            dot.remove();
        }, 800);
    }

    // --- Icon Link Double-Click Logic ---
    iconLinks.forEach(link => {
        // Prevent default single-click behavior (navigation)
        link.addEventListener('click', (event) => {
            event.preventDefault();
        });

        // Handle double-click to open link
        link.addEventListener('dblclick', (event) => {
            // Ensure we get the link (even if the click is on the <i> icon inside)
            const targetLink = event.currentTarget.href;
            if (targetLink) {
                window.open(targetLink, '_blank'); // Open in new tab
            }
        });
    });

});
