/**
 * SAA Cyber Card - Industrial Metal Interface
 * JavaScript for hover tracking grid interaction
 */

(function() {
    'use strict';

    /**
     * Initialize hover tracking for industrial metal card
     */
    function initIndustrialMetalCard() {
        const containers = document.querySelectorAll('.saa-industrial-metal-container');

        containers.forEach(container => {
            const canvas = container.querySelector('.saa-industrial-metal-canvas');
            const card = container.querySelector('.saa-industrial-metal-card');
            const trackers = container.querySelectorAll('.saa-industrial-metal-tracker');

            if (!canvas || !card || trackers.length === 0) return;

            let currentRow = -1;
            let currentCol = -1;

            /**
             * Handle tracker hover - update card tilt based on grid position
             */
            trackers.forEach(tracker => {
                tracker.addEventListener('mouseenter', function() {
                    const row = parseInt(this.getAttribute('data-row'));
                    const col = parseInt(this.getAttribute('data-col'));

                    currentRow = row;
                    currentCol = col;

                    // Calculate tilt based on position (5x5 grid)
                    // Center is (2, 2), edges are (0,0) to (4,4)
                    const centerRow = 2;
                    const centerCol = 2;

                    // Tilt range: -8deg to +8deg
                    const maxTilt = 8;
                    const tiltY = ((col - centerCol) / centerCol) * maxTilt;
                    const tiltX = -((row - centerRow) / centerRow) * maxTilt;

                    // Apply 3D transform with smooth transition
                    card.style.transform = `
                        perspective(1000px)
                        rotateX(${tiltX}deg)
                        rotateY(${tiltY}deg)
                        translateZ(10px)
                    `;

                    // Add subtle highlight based on position
                    const highlightIntensity = 0.05 + (Math.abs(tiltX) + Math.abs(tiltY)) / (maxTilt * 2) * 0.1;
                    card.style.boxShadow = `
                        0 0 60px rgba(255, 215, 0, ${highlightIntensity * 0.5}),
                        inset 0 0 50px rgba(255, 215, 0, ${highlightIntensity}),
                        inset 0 2px 4px rgba(255, 255, 255, 0.2),
                        inset 0 -2px 4px rgba(0, 0, 0, 0.4)
                    `;
                });
            });

            /**
             * Reset card position when mouse leaves container
             */
            container.addEventListener('mouseleave', function() {
                currentRow = -1;
                currentCol = -1;

                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                card.style.boxShadow = `
                    0 0 40px rgba(0, 0, 0, 0.6),
                    inset 0 0 40px rgba(255, 255, 255, 0.08),
                    inset 0 2px 4px rgba(255, 255, 255, 0.15),
                    inset 0 -2px 4px rgba(0, 0, 0, 0.3)
                `;
            });

            /**
             * Track mouse movement for smooth parallax effect
             */
            canvas.addEventListener('mousemove', function(e) {
                if (currentRow === -1 || currentCol === -1) return;

                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Normalized coordinates (0 to 1)
                const normalizedX = x / rect.width;
                const normalizedY = y / rect.height;

                // Subtle shift effect within the current tracker cell
                const microTiltX = (normalizedY - 0.5) * 2;
                const microTiltY = (normalizedX - 0.5) * 2;

                // Apply micro-adjustments to existing tilt
                const centerRow = 2;
                const centerCol = 2;
                const maxTilt = 8;

                const baseTiltY = ((currentCol - centerCol) / centerCol) * maxTilt;
                const baseTiltX = -((currentRow - centerRow) / centerRow) * maxTilt;

                const finalTiltX = baseTiltX + microTiltX;
                const finalTiltY = baseTiltY + microTiltY;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${finalTiltX}deg)
                    rotateY(${finalTiltY}deg)
                    translateZ(10px)
                `;
            });
        });
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIndustrialMetalCard);
    } else {
        initIndustrialMetalCard();
    }

    /**
     * Re-initialize on dynamic content load
     */
    window.addEventListener('load', initIndustrialMetalCard);

    // Export for manual initialization
    window.initIndustrialMetalCard = initIndustrialMetalCard;
})();
