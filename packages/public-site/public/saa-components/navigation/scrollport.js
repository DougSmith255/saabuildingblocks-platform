/**
 * SAA Scrollport Component
 * Features: Looped scrolling, page scroll sync, arrow navigation
 */

(function() {
    'use strict';

    class SAAScrollport {
        constructor(container) {
            this.container = container;
            this.scrollport = container.querySelector('.saa-scrollport');
            this.tiles = [...container.querySelectorAll('.saa-scrollport-tile')];
            this.leftArrow = container.querySelector('.saa-scrollport-nav-left');
            this.rightArrow = container.querySelector('.saa-scrollport-nav-right');
            
            this.tileWidth = 0;
            this.scrollWidth = 0;
            this.isLooping = false;
            this.pageScrollMultiplier = this.getResponsiveScrollMultiplier();
            this.lastPageScroll = window.scrollY;
            
            this.init();
        }

        init() {
            this.setupDimensions();
            this.setupInfiniteLoop();
            this.setupArrowNavigation();
            this.setupPageScrollSync();
            this.setupResizeHandler();
        }

        setupDimensions() {
            if (this.tiles.length === 0) return;
            
            // Calculate tile width including gap
            const tileRect = this.tiles[0].getBoundingClientRect();
            const computedStyle = getComputedStyle(this.scrollport);
            const gap = parseInt(computedStyle.gap) || 32; // 2rem default
            
            this.tileWidth = tileRect.width + gap;
            this.scrollWidth = this.scrollport.scrollWidth;
        }

        setupInfiniteLoop() {
            if (this.tiles.length === 0) return;
            
            // Clone tiles for seamless loop
            const originalTiles = [...this.tiles];
            
            // Add clones at the end
            originalTiles.forEach(tile => {
                const clone = tile.cloneNode(true);
                clone.classList.add('clone');
                this.scrollport.appendChild(clone);
            });
            
            // Add clones at the beginning
            originalTiles.reverse().forEach(tile => {
                const clone = tile.cloneNode(true);
                clone.classList.add('clone');
                this.scrollport.insertBefore(clone, this.scrollport.firstChild);
            });
            
            // Update tiles list to include clones
            this.tiles = [...this.scrollport.querySelectorAll('.saa-scrollport-tile')];
            
            // Set initial scroll position to show original tiles
            this.scrollport.scrollLeft = originalTiles.length * this.tileWidth;
            
            this.setupLoopDetection();
        }

        setupLoopDetection() {
            let scrollTimeout;
            
            this.scrollport.addEventListener('scroll', () => {
                if (this.isLooping) return;
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.checkLoopBoundaries();
                }, 100);
            });
        }

        checkLoopBoundaries() {
            const scrollLeft = this.scrollport.scrollLeft;
            const maxScroll = this.scrollport.scrollWidth - this.scrollport.clientWidth;
            const originalTileCount = this.tiles.length / 3; // Original tiles (excluding clones)
            const sectionWidth = originalTileCount * this.tileWidth;
            
            this.isLooping = true;
            
            if (scrollLeft <= 0) {
                // Reached beginning, jump to end of original section
                this.scrollport.scrollLeft = sectionWidth * 2;
            } else if (scrollLeft >= maxScroll) {
                // Reached end, jump to beginning of original section
                this.scrollport.scrollLeft = sectionWidth;
            } else if (scrollLeft < sectionWidth) {
                // In first clone section, jump to original section
                this.scrollport.scrollLeft = scrollLeft + sectionWidth;
            } else if (scrollLeft >= sectionWidth * 2) {
                // In last clone section, jump to original section
                this.scrollport.scrollLeft = scrollLeft - sectionWidth;
            }
            
            setTimeout(() => {
                this.isLooping = false;
            }, 10);
        }

        setupArrowNavigation() {
            if (!this.leftArrow || !this.rightArrow) return;
            
            // Get the actual button elements inside the nav containers
            const leftButton = this.leftArrow.querySelector('.saa-scrollport-arrow-btn');
            const rightButton = this.rightArrow.querySelector('.saa-scrollport-arrow-btn');
            
            if (leftButton) {
                leftButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollByTiles(-1);
                });
            }
            
            if (rightButton) {
                rightButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollByTiles(1);
                });
            }
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.scrollByTiles(-1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.scrollByTiles(1);
                }
            });
        }

        scrollByTiles(direction) {
            const scrollAmount = this.tileWidth * direction;
            this.scrollport.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }

        setupPageScrollSync() {
            let ticking = false;
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.syncWithPageScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }

        syncWithPageScroll() {
            const currentPageScroll = window.scrollY;
            const scrollDelta = currentPageScroll - this.lastPageScroll;
            
            if (Math.abs(scrollDelta) > 1) { // Minimum threshold to avoid micro-movements
                const tileScrollDelta = scrollDelta * this.pageScrollMultiplier;
                
                // Apply scroll without smooth behavior for real-time sync
                const currentScrollBehavior = this.scrollport.style.scrollBehavior;
                this.scrollport.style.scrollBehavior = 'auto';
                
                this.scrollport.scrollLeft += tileScrollDelta;
                
                // Restore smooth scrolling
                setTimeout(() => {
                    this.scrollport.style.scrollBehavior = currentScrollBehavior;
                }, 10);
            }
            
            this.lastPageScroll = currentPageScroll;
        }

        getResponsiveScrollMultiplier() {
            const screenWidth = window.innerWidth;
            
            if (screenWidth <= 479) {
                // Mobile: Faster scroll (more intense)
                return 1.2;
            } else if (screenWidth <= 768) {
                // Mobile Large: Faster scroll
                return 1.0;
            } else if (screenWidth <= 1024) {
                // Tablet: Moderately faster scroll
                return 0.8;
            } else {
                // Desktop: Normal scroll speed
                return 0.5;
            }
        }

        setupResizeHandler() {
            window.addEventListener('resize', () => {
                setTimeout(() => {
                    this.setupDimensions();
                    // Update scroll multiplier for new screen size
                    this.pageScrollMultiplier = this.getResponsiveScrollMultiplier();
                }, 100);
            });
        }

        // Public methods
        scrollToTile(index) {
            const targetScroll = index * this.tileWidth;
            this.scrollport.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }

        destroy() {
            // Cleanup event listeners if needed
        }
    }

    // Initialize all scrollports when DOM is ready
    function initScrollports() {
        const scrollportContainers = document.querySelectorAll('.saa-scrollport-container');
        
        scrollportContainers.forEach(container => {
            new SAAScrollport(container);
        });
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollports);
    } else {
        initScrollports();
    }

    // Make available globally for debugging
    window.SAAScrollport = SAAScrollport;

})();