/**
 * SAA Team Carousel JavaScript - Based on Original Working 3D Carousel
 * Adapted from original working code with SAA integration and 7 team members
 */

const saaTeamMembers = [
    { name: "Sarah Johnson", role: "Team Leader & Mentor" },
    { name: "Michael Chen", role: "Luxury Home Specialist" },
    { name: "Jessica Rodriguez", role: "First-Time Buyer Expert" },
    { name: "David Thompson", role: "Commercial Real Estate" },
    { name: "Lisa Anderson", role: "Investment Properties" },
    { name: "Robert Kim", role: "Market Analysis Expert" },
    { name: "Amanda White", role: "Client Success Manager" }
];

let saaCarouselInitialized = false;

function initSAATeamCarousel() {
    // Prevent multiple initializations
    if (saaCarouselInitialized) {
        console.log('SAA Team Carousel already initialized');
        return;
    }

    console.log('🎠 Initializing SAA Team Carousel');

    const cards = document.querySelectorAll(".saa-team-card");
    const dots = document.querySelectorAll(".saa-team-dot");
    const memberName = document.querySelector(".saa-team-member-name");
    const memberRole = document.querySelector(".saa-team-member-role");
    const upArrows = document.querySelectorAll(".saa-team-nav-arrow.up");
    const downArrows = document.querySelectorAll(".saa-team-nav-arrow.down");
    const centerCard = document.querySelector(".saa-team-card.center");

    if (!cards.length || !memberName || !memberRole) {
        console.error('❌ SAA Team Carousel: Required elements not found');
        return;
    }

    console.log(`✅ Found ${cards.length} cards, ${upArrows.length} up arrows, ${downArrows.length} down arrows`);

    let currentIndex = 0;
    let isAnimating = false;

    // Initialize mobile data attributes on center card
    if (centerCard) {
        centerCard.setAttribute('data-member-name', saaTeamMembers[0].name);
        centerCard.setAttribute('data-member-role', saaTeamMembers[0].role);
    }

    function updateCarousel(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        console.log(`🔄 Updating carousel from ${currentIndex} to ${newIndex}`);

        currentIndex = (newIndex + cards.length) % cards.length;

        cards.forEach((card, i) => {
            const offset = (i - currentIndex + cards.length) % cards.length;

            card.classList.remove(
                "center",
                "up-1",
                "up-2",
                "down-1",
                "down-2",
                "hidden"
            );

            if (offset === 0) {
                card.classList.add("center");
            } else if (offset === 1) {
                card.classList.add("down-1");
            } else if (offset === 2) {
                card.classList.add("down-2");
            } else if (offset === cards.length - 1) {
                card.classList.add("up-1");
            } else if (offset === cards.length - 2) {
                card.classList.add("up-2");
            } else {
                card.classList.add("hidden");
            }
        });

        // Update dots if they exist
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });

        // Update member info with fade effect
        if (memberName && memberRole) {
            memberName.style.opacity = "0";
            memberRole.style.opacity = "0";

            setTimeout(() => {
                memberName.textContent = saaTeamMembers[currentIndex].name;
                memberRole.textContent = saaTeamMembers[currentIndex].role;
                memberName.style.opacity = "1";
                memberRole.style.opacity = "1";
            }, 300);
        }

        // Update mobile overlay data attributes on center card
        const currentCenterCard = document.querySelector('.saa-team-card.center');
        if (currentCenterCard) {
            currentCenterCard.setAttribute('data-member-name', saaTeamMembers[currentIndex].name);
            currentCenterCard.setAttribute('data-member-role', saaTeamMembers[currentIndex].role);
        }

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Bind arrow events
    upArrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            console.log('⬆️ Up arrow clicked');
            updateCarousel(currentIndex - 1);
        });
    });

    downArrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            console.log('⬇️ Down arrow clicked');
            updateCarousel(currentIndex + 1);
        });
    });

    // Bind dot events
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            console.log(`🎯 Dot ${i} clicked`);
            updateCarousel(i);
        });
    });

    // Bind card click events
    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            console.log(`🃏 Card ${i} clicked`);
            updateCarousel(i);
        });
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            console.log('⌨️ Up arrow key pressed');
            updateCarousel(currentIndex - 1);
        } else if (e.key === "ArrowDown") {
            console.log('⌨️ Down arrow key pressed');
            updateCarousel(currentIndex + 1);
        }
    });

    // Touch/swipe support
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener("touchstart", (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                console.log('👆 Swipe up detected');
                updateCarousel(currentIndex + 1);
            } else {
                console.log('👇 Swipe down detected');
                updateCarousel(currentIndex - 1);
            }
        }
    }

    // Initialize carousel
    updateCarousel(0);
    saaCarouselInitialized = true;
    console.log('🎉 SAA Team Carousel initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSAATeamCarousel);
} else {
    // DOM already loaded
    initSAATeamCarousel();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (!saaCarouselInitialized) {
        console.log('🔄 Backup initialization attempt');
        initSAATeamCarousel();
    }
});