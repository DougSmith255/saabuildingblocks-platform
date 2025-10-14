/*!
 * Accordion Component JavaScript
 * Handles expand/collapse functionality with accessibility support
 * Compatible with ViewportManager system and performance optimized
 */

(function() {
    'use strict';

    // Accordion functionality
    class AccordionManager {
        constructor() {
            this.accordions = [];
            this.init();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupAccordions());
            } else {
                this.setupAccordions();
            }
        }

        setupAccordions() {
            // Find all accordions on the page
            const accordionContainers = document.querySelectorAll('.accordion');

            accordionContainers.forEach(container => {
                this.initializeAccordion(container);
            });

            // Setup mutation observer for dynamically added accordions
            this.setupMutationObserver();
        }

        initializeAccordion(container) {
            const items = container.querySelectorAll('.accordion-item');

            items.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');

                if (!header || !content) return;

                // Set up accessibility attributes
                this.setupAccessibility(header, content, item);

                // Add click event listener
                header.addEventListener('click', (e) => {
                    this.toggleItem(item, container);
                });

                // Add keyboard event listener
                header.addEventListener('keydown', (e) => {
                    this.handleKeydown(e, item, container);
                });
            });

            // Store reference to this accordion
            this.accordions.push(container);
        }

        setupAccessibility(header, content, item) {
            // Generate unique IDs if they don't exist
            const itemId = item.id || `accordion-item-${Math.random().toString(36).substr(2, 9)}`;
            const headerId = `${itemId}-header`;
            const contentId = `${itemId}-content`;

            item.id = itemId;
            header.id = headerId;
            content.id = contentId;

            // Set ARIA attributes
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', contentId);
            header.setAttribute('tabindex', '0');

            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', headerId);
            content.setAttribute('aria-hidden', 'true');
        }

        toggleItem(item, container) {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            const isExpanded = item.classList.contains('expanded');

            if (isExpanded) {
                this.collapseItem(item, header, content);
            } else {
                // Always close other items (single-item-open behavior by default)
                // Only allow multiple if explicitly set with data-allow-multiple
                const allowMultiple = container.hasAttribute('data-allow-multiple');

                if (!allowMultiple) {
                    // Close other items in this accordion
                    this.collapseOtherItems(container, item);
                }

                this.expandItem(item, header, content);
            }
        }

        expandItem(item, header, content) {
            // Add expanded class
            item.classList.add('expanded');

            // Update ARIA attributes
            header.setAttribute('aria-expanded', 'true');
            content.setAttribute('aria-hidden', 'false');

            // Smooth height animation
            this.animateHeight(content, true);

            // Emit custom event
            item.dispatchEvent(new CustomEvent('accordion:expanded', {
                bubbles: true,
                detail: { item, header, content }
            }));
        }

        collapseItem(item, header, content) {
            // Remove expanded class
            item.classList.remove('expanded');

            // Update ARIA attributes
            header.setAttribute('aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');

            // Smooth height animation
            this.animateHeight(content, false);

            // Emit custom event
            item.dispatchEvent(new CustomEvent('accordion:collapsed', {
                bubbles: true,
                detail: { item, header, content }
            }));
        }

        collapseOtherItems(container, currentItem) {
            const items = container.querySelectorAll('.accordion-item.expanded');

            items.forEach(item => {
                if (item !== currentItem) {
                    const header = item.querySelector('.accordion-header');
                    const content = item.querySelector('.accordion-content');
                    this.collapseItem(item, header, content);
                }
            });
        }

        animateHeight(content, expand) {
            // Get the inner content height
            const inner = content.querySelector('.accordion-content-inner');
            if (!inner) return;

            if (expand) {
                // ULTRA SMOOTH EXPAND: Reset CSS transition temporarily for instant setup
                const originalTransition = content.style.transition;
                content.style.transition = 'none';

                // Start from collapsed state
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.style.padding = '0 var(--space-5, 1.25rem) 0';

                // Force browser reflow to apply instant changes
                content.offsetHeight;

                // Re-enable smooth transitions
                content.style.transition = originalTransition || '';

                // Calculate precise content height including padding
                const paddingTop = parseFloat(getComputedStyle(content).paddingTop) || 0;
                const paddingBottom = parseFloat(getComputedStyle(content).paddingBottom) || 0;
                const contentHeight = inner.scrollHeight;
                const totalHeight = contentHeight + paddingTop + paddingBottom;

                // Animate to full height smoothly
                requestAnimationFrame(() => {
                    content.style.maxHeight = totalHeight + 20 + 'px'; // Add buffer for safety
                    content.style.opacity = '1';
                    content.style.padding = '0 var(--space-5, 1.25rem) var(--space-4, 1rem)';
                });

                // Clean up after animation completes
                setTimeout(() => {
                    if (content.parentElement && content.parentElement.classList.contains('expanded')) {
                        content.style.maxHeight = 'none'; // Allow natural expansion
                    }
                }, 450);

            } else {
                // ULTRA SMOOTH COLLAPSE: Get current computed height
                const computedStyle = getComputedStyle(content);
                const currentHeight = content.scrollHeight;

                // Set current height explicitly for smooth collapse
                content.style.maxHeight = currentHeight + 'px';

                // Force reflow
                content.offsetHeight;

                // Animate to collapsed state
                requestAnimationFrame(() => {
                    content.style.maxHeight = '0px';
                    content.style.opacity = '0';
                    content.style.padding = '0 var(--space-5, 1.25rem) 0';
                });
            }
        }

        handleKeydown(e, item, container) {
            const header = item.querySelector('.accordion-header');

            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.toggleItem(item, container);
                    break;

                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    this.focusNextItem(container, item);
                    break;

                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    this.focusPreviousItem(container, item);
                    break;

                case 'Home':
                    e.preventDefault();
                    this.focusFirstItem(container);
                    break;

                case 'End':
                    e.preventDefault();
                    this.focusLastItem(container);
                    break;
            }
        }

        focusNextItem(container, currentItem) {
            const items = Array.from(container.querySelectorAll('.accordion-item'));
            const currentIndex = items.indexOf(currentItem);
            const nextIndex = (currentIndex + 1) % items.length;
            const nextHeader = items[nextIndex].querySelector('.accordion-header');
            nextHeader.focus();
        }

        focusPreviousItem(container, currentItem) {
            const items = Array.from(container.querySelectorAll('.accordion-item'));
            const currentIndex = items.indexOf(currentItem);
            const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            const prevHeader = items[prevIndex].querySelector('.accordion-header');
            prevHeader.focus();
        }

        focusFirstItem(container) {
            const firstHeader = container.querySelector('.accordion-header');
            if (firstHeader) firstHeader.focus();
        }

        focusLastItem(container) {
            const headers = container.querySelectorAll('.accordion-header');
            const lastHeader = headers[headers.length - 1];
            if (lastHeader) lastHeader.focus();
        }

        setupMutationObserver() {
            // Watch for dynamically added accordions
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node is an accordion or contains accordions
                            if (node.classList && node.classList.contains('accordion')) {
                                this.initializeAccordion(node);
                            } else if (node.querySelectorAll) {
                                const accordions = node.querySelectorAll('.accordion');
                                accordions.forEach(accordion => {
                                    if (!this.accordions.includes(accordion)) {
                                        this.initializeAccordion(accordion);
                                    }
                                });
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Public API methods
        expandAll(container) {
            const items = container.querySelectorAll('.accordion-item:not(.expanded)');
            items.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');
                this.expandItem(item, header, content);
            });
        }

        collapseAll(container) {
            const items = container.querySelectorAll('.accordion-item.expanded');
            items.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');
                this.collapseItem(item, header, content);
            });
        }

        // Utility method to get accordion by ID
        getAccordion(id) {
            return document.getElementById(id);
        }
    }

    // Initialize accordion manager
    const accordionManager = new AccordionManager();

    // Export to global scope for external access
    window.AccordionManager = {
        expandAll: (containerId) => {
            const container = document.getElementById(containerId);
            if (container) accordionManager.expandAll(container);
        },
        collapseAll: (containerId) => {
            const container = document.getElementById(containerId);
            if (container) accordionManager.collapseAll(container);
        },
        get: (containerId) => {
            return accordionManager.getAccordion(containerId);
        }
    };

})();