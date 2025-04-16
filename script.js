document.addEventListener('DOMContentLoaded', () => {
    // Select necessary elements
    const entryScreen = document.getElementById('entry-screen');
    const mainContent = document.getElementById('main-content');
    const backgroundMusic = document.getElementById('background-music');
    const customCursor = document.getElementById('custom-cursor');
    const iconLinks = document.querySelectorAll('.icon-link');
    const scrollingBanner = document.getElementById('scrolling-banner');
    // Footer Link Double-Click Logic START
    const footerLink = document.querySelector('.footer-credit'); // Select footer link
    // Footer Link Double-Click Logic END

    // Set the initial content for the new text cursor
    if (customCursor) {
        customCursor.textContent = '𖹭';
    }

    // --- Entry Screen Logic ---
    entryScreen.addEventListener('click', () => {
        entryScreen.classList.add('hidden');
        if (scrollingBanner) {
            scrollingBanner.style.display = 'block';
        }
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
        if (customCursor) {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        }
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
        link.addEventListener('click', (event) => {
            event.preventDefault();
        });
        link.addEventListener('dblclick', (event) => {
            const targetLink = event.currentTarget.href;
            if (targetLink) {
                window.open(targetLink, '_blank');
            }
        });
    });

    // --- Footer Link Double-Click Logic START ---
    if (footerLink) {
        footerLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent single-click navigation
        });
        footerLink.addEventListener('dblclick', (event) => {
            const targetLink = event.currentTarget.href;
            if (targetLink) {
                window.open(targetLink, '_blank'); // Open wry.rip on double-click
            }
        });
    }
    // --- Footer Link Double-Click Logic END ---

});
