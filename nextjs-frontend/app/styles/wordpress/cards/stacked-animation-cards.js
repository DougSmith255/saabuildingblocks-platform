/**
 * SmartAgentAlliance Stacked Animation Cards JavaScript
 * Handles scroll-based stacking animations for 5+ cards
 *
 * Dependencies: Motion One library (https://motion.dev/)
 * Usage: For sections with 5+ cards that need interactive stacking
 */

// Load Motion One library with local-first strategy and CDN fallbacks
function loadMotionOne() {
  return new Promise((resolve, reject) => {
    if (typeof motion !== 'undefined') {
      resolve();
      return;
    }

    // Define fallback URLs in priority order
    const fallbackUrls = [
      // Local version first (bundled with theme)
      '/wp-content/themes/generatepress-child/assets/js/vendors/motion.js',
      // CDN fallbacks
      'https://unpkg.com/motion@10.16.2/dist/motion.js',
      'https://cdn.skypack.dev/motion@10.13.1',
      'https://cdn.jsdelivr.net/npm/motion@10.16.2/dist/motion.js'
    ];

    console.log('SAA Stacked Cards: Loading Motion One library...');

    tryLoadFromUrls(fallbackUrls, 0, resolve, reject);
  });
}

// Recursively try loading from fallback URLs
function tryLoadFromUrls(urls, index, resolve, reject) {
  if (index >= urls.length) {
    console.error('SAA Stacked Cards: All Motion One sources failed, using native fallback');
    reject();
    return;
  }

  const url = urls[index];
  const isLocal = !url.startsWith('http');
  const isSkypack = url.includes('skypack.dev');

  console.log(`SAA Stacked Cards: Trying ${isLocal ? 'local' : 'CDN'} source ${index + 1}/${urls.length}: ${url}`);

  tryLoadMotionOne(url, () => {
    console.log(`SAA Stacked Cards: Motion One loaded successfully from ${isLocal ? 'local' : 'CDN'} source: ${url}`);
    resolve();
  }, () => {
    console.warn(`SAA Stacked Cards: Failed to load from ${url}, trying next source...`);
    tryLoadFromUrls(urls, index + 1, resolve, reject);
  }, isSkypack);
}

// Helper function to attempt loading from a specific URL (local or CDN)
function tryLoadMotionOne(url, resolve, reject, isESM = false) {
  const script = document.createElement('script');
  script.src = url;

  // Only use module type for Skypack (ESM), not for local/unpkg/jsdelivr (UMD)
  if (isESM) {
    script.type = 'module';
  }

  // Add timeout for better error handling
  const timeout = setTimeout(() => {
    console.error(`SAA Stacked Cards: Timeout loading Motion One from ${url}`);
    document.head.removeChild(script);
    reject();
  }, 5000);

  script.onload = () => {
    clearTimeout(timeout);
    // Verify Motion One actually loaded and is available
    if (typeof motion !== 'undefined') {
      resolve();
    } else {
      console.warn(`SAA Stacked Cards: Script loaded from ${url} but Motion One not available`);
      reject();
    }
  };

  script.onerror = () => {
    clearTimeout(timeout);
    console.error(`SAA Stacked Cards: Failed to load Motion One from ${url}`);
    reject();
  };

  document.head.appendChild(script);
}

// Initialize stacked cards animation
function initSAAStackedCards() {
  console.log('SAA Stacked Cards: Initializing...');

  const cardContainers = document.querySelectorAll('.saa-stacked-animation-cards');

  if (cardContainers.length === 0) {
    console.warn('SAA Stacked Cards: No containers found');
    return;
  }

  console.log(`SAA Stacked Cards: Found ${cardContainers.length} containers`);

  // Log card containers found
  cardContainers.forEach((container, index) => {
    const cards = container.querySelectorAll('.saa-stacked-animation-card');
    console.log(`Container ${index}: Found ${cards.length} cards`);
  });

  // Then try to load animation library
  if (typeof motion === 'undefined') {
    console.warn('SAA Stacked Cards: Motion One library not found. Loading from CDN...');
    loadMotionOne().then(() => {
      setupStackedCards();
    }).catch(() => {
      console.error('SAA Stacked Cards: Failed to load Motion One, using fallback');
      fallbackStyling();
    });
    return;
  }

  setupStackedCards();
}

// Native scroll animation implementation (replaces Motion One external dependency)
function createNativeScrollAnimation(element, animation, options) {
  const target = options.target || element;

  // Parse offset values: ["start 50%", "end 80%"]
  const startOffset = options.offset ? options.offset[0] : "start 0%";
  const endOffset = options.offset ? options.offset[1] : "end 100%";

  // Convert offset strings to usable values
  function parseOffset(offset, targetRect, windowHeight) {
    if (offset.includes("start")) {
      const percentage = parseFloat(offset.match(/(\d+)%/)?.[1] || 0) / 100;
      return targetRect.top - (windowHeight * percentage);
    } else if (offset.includes("end")) {
      const percentage = parseFloat(offset.match(/(\d+)%/)?.[1] || 0) / 100;
      return targetRect.bottom - (windowHeight * percentage);
    }
    return 0;
  }

  function updateAnimation() {
    const targetRect = target.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const startPoint = parseOffset(startOffset, targetRect, windowHeight);
    const endPoint = parseOffset(endOffset, targetRect, windowHeight);

    // Calculate progress (0 to 1)
    let progress = (startPoint) / (startPoint - endPoint);
    progress = Math.max(0, Math.min(1, progress));

    // Apply scale animation
    if (animation.scale) {
      const [startScale, endScale] = animation.scale;
      const currentScale = startScale + (endScale - startScale) * progress;
      element.style.transform = `translateY(-50%) scale(${currentScale})`;
    }
  }

  // Initial update
  updateAnimation();

  // Add scroll listener
  function scrollHandler() {
    requestAnimationFrame(updateAnimation);
  }

  window.addEventListener('scroll', scrollHandler, { passive: true });
  window.addEventListener('resize', scrollHandler, { passive: true });

  return {
    destroy: () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', scrollHandler);
    }
  };
}

// Native animate function (replaces Motion One animate)
function nativeAnimate(element, animation) {
  return {
    element,
    animation
  };
}

// Native scroll function (replaces Motion One scroll)
function nativeScroll(animationObj, options) {
  return createNativeScrollAnimation(animationObj.element, animationObj.animation, options);
}

// Setup stacked cards animation
function setupStackedCards() {
  const cardContainers = document.querySelectorAll('.saa-stacked-animation-cards');

  if (cardContainers.length === 0) {
    return; // No stacked card containers found
  }

  // Use Motion One if available, otherwise fall back to native implementation
  let motionAPI;

  if (typeof motion !== 'undefined' && motion.scroll && motion.animate) {
    console.log('SAA Stacked Cards: Using Motion One library for animations');
    motionAPI = {
      scroll: motion.scroll,
      animate: motion.animate
    };
  } else {
    console.log('SAA Stacked Cards: Using native fallback animations');
    motionAPI = {
      scroll: nativeScroll,
      animate: nativeAnimate
    };
  }

  cardContainers.forEach((container, containerIndex) => {
    initializeCardContainer(container, containerIndex, motionAPI);
  });
}


// Initialize individual card container
function initializeCardContainer($cardsWrapper, containerIndex, { scroll, animate }) {
  const $cards = $cardsWrapper.querySelectorAll('.saa-stacked-animation-card');

  if ($cards.length === 0) {
    return;
  }

  const numCards = $cards.length;

  // Update CSS custom property for number of cards
  $cardsWrapper.style.setProperty('--saa-numcards', numCards);

  // Add appropriate class for card count
  $cardsWrapper.classList.add(`saa-cards-${numCards}`);

  // Setup corner lights FIRST - independent of Motion One
  $cards.forEach(($card, index0) => {
    const index = index0 + 1;
    // Setup corner lights immediately - NOT dependent on Motion One
    setupScrollTriggeredLights($card, index, $cardsWrapper);
  });

  $cards.forEach(($card, index0) => {
    const index = index0 + 1;
    const reverseIndex0 = numCards - index;

    // Set padding for stacking effect
    $card.style.paddingTop = `calc(${index} * var(--saa-card-top-offset))`;

    // Make cards sticky at center of viewport
    $card.style.position = 'sticky';
    $card.style.top = '18vh';
    $card.style.transform = 'translateY(-50%)';

    // Create scroll-linked animation (depends on Motion One)
    try {
      scroll(
        animate($card, {
          // Earlier cards shrink more than later cards
          scale: [1, 1 - (0.1 * reverseIndex0)],
        }), {
          // Animation triggers when cards are stuck in center
          target: $cardsWrapper,
          offset: ["start 50%", "end 80%"],
        }
      );
    } catch (error) {
      console.warn('SAA Stacked Cards: Animation setup failed for card', index, error);
    }
  });

  // Add loaded class for styling
  $cardsWrapper.classList.add('saa-cards-loaded');

  console.log(`SAA Stacked Cards: Initialized container ${containerIndex + 1} with ${numCards} cards`);
}

// Setup scroll-triggered corner lights for when card reaches sticky position
function setupScrollTriggeredLights($card, cardIndex, $cardsWrapper) {
  try {
    console.log(`SAA Stacked Cards: Setting up corner lights for card ${cardIndex}`);

    // Find the top corner elements in this card
    const topLeftCorner = $card.querySelector('.saa-cyber-prismatic-corners span:first-child');
    const topRightCorner = $card.querySelector('.saa-cyber-prismatic-corners span:nth-child(2)');

    console.log(`SAA Stacked Cards: Card ${cardIndex} - Found corners:`, {
      topLeft: !!topLeftCorner,
      topRight: !!topRightCorner,
      cardElement: $card
    });

    if (topLeftCorner && topRightCorner) {
      let lightsActivated = false; // Prevent multiple activations

      // Use visual position tracking instead of static offsetTop for stacked animation
      const screenCenter = window.innerHeight * 0.5; // 50vh - center of screen
      let previousCardTop = $card.getBoundingClientRect().top; // Track previous position for direction

      console.log(`SAA Stacked Cards: Setting up repeatable visual position tracker for card ${cardIndex}`);

      // Create scroll listener that tracks visual position and allows re-triggering
      const scrollHandler = () => {
        const cardRect = $card.getBoundingClientRect();
        const cardVisualTop = cardRect.top; // Current visual position from top of viewport

        // Determine scroll direction based on card movement
        const movingUp = cardVisualTop < previousCardTop;
        const movingDown = cardVisualTop > previousCardTop;

        // Trigger when card crosses center while moving up, allow re-trigger
        if (cardVisualTop <= screenCenter && movingUp && !lightsActivated) {
          lightsActivated = true;
          console.log(`SAA Stacked Cards: TRIGGERED! Card ${cardIndex} crossed screen center moving UP (visual top: ${cardVisualTop}px, center: ${screenCenter}px)`);
          activateExistingHoverEffect(topLeftCorner, topRightCorner, cardIndex);
        }

        // Reset trigger when card moves significantly below center (allow re-triggering)
        if (cardVisualTop > screenCenter + 100 && lightsActivated) {
          lightsActivated = false;
          console.log(`SAA Stacked Cards: RESET Card ${cardIndex} trigger - moved below center (visual top: ${cardVisualTop}px)`);
        }

        // Update previous position for next scroll event
        previousCardTop = cardVisualTop;
      };

      // Add scroll listener for visual position tracking (no removal for re-triggering)
      window.addEventListener('scroll', scrollHandler, { passive: true });

      // Also check initial position in case card is already past center
      scrollHandler();
    }
  } catch (error) {
    console.warn('SAA Stacked Cards: Corner light setup failed for card', cardIndex, error);
  }
}

// Activate existing hover effect for 3 seconds when triggered by scroll
function activateExistingHoverEffect(topLeft, topRight, cardIndex) {
  try {
    console.log(`SAA Stacked Cards: Activating yellow corner lines for card ${cardIndex} (using existing hover effect)`);

    // Enable hardware acceleration for smooth animation using WillChangeManager
    if (window.WillChangeManager) {
      window.WillChangeManager.enable(topLeft, 'border-color, box-shadow', 3300);
      window.WillChangeManager.enable(topRight, 'border-color, box-shadow', 3300);
    } else {
      // Fallback for when WillChangeManager isn't loaded
      topLeft.style.willChange = 'border-color, box-shadow';
      topRight.style.willChange = 'border-color, box-shadow';
    }

    // Add active class to trigger the existing hover-style effect
    topLeft.classList.add('saa-corner-light-active');
    topRight.classList.add('saa-corner-light-active');

    // Remove active class after 3 seconds and clean up performance hints
    setTimeout(() => {
      topLeft.classList.remove('saa-corner-light-active');
      topRight.classList.remove('saa-corner-light-active');

      // Clean up performance hints after animation completes
      if (window.WillChangeManager) {
        // WillChangeManager will auto-cleanup
      } else {
        setTimeout(() => {
          topLeft.style.willChange = 'auto';
          topRight.style.willChange = 'auto';
        }, 300);
      }

      console.log(`SAA Stacked Cards: Yellow corner lines deactivated for card ${cardIndex}`);
    }, 3000);

  } catch (error) {
    console.warn('SAA Stacked Cards: Corner light activation failed for card', cardIndex, error);
  }
}

// Fallback styling without animations
function fallbackStyling() {
  const cardContainers = document.querySelectorAll('.saa-stacked-animation-cards');

  cardContainers.forEach(container => {
    const cards = container.querySelectorAll('.saa-stacked-animation-card');
    const numCards = cards.length;

    // Set basic stacking without animation
    cards.forEach((card, index) => {
      card.style.paddingTop = `calc(${index + 1} * var(--saa-card-top-offset))`;
      card.style.position = 'sticky';
      card.style.top = '0';
    });

    // Update CSS custom property
    container.style.setProperty('--saa-numcards', numCards);
    container.classList.add(`saa-cards-${numCards}`, 'saa-cards-fallback');

    console.log('SAA Stacked Cards: Using fallback styling (no animations)');
  });
}

// Utility function to refresh animations (useful for dynamic content)
function refreshSAAStackedCards() {
  // Remove loaded classes
  document.querySelectorAll('.saa-stacked-animation-cards').forEach(container => {
    container.classList.remove('saa-cards-loaded');
  });
  
  // Reinitialize
  setupStackedCards();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSAAStackedCards);
} else {
  initSAAStackedCards();
}

// Initialize on window load as backup
window.addEventListener('load', () => {
  // Double-check initialization after a short delay
  setTimeout(() => {
    const uninitializedContainers = document.querySelectorAll('.saa-stacked-animation-cards:not(.saa-cards-loaded)');
    if (uninitializedContainers.length > 0) {
      console.log('SAA Stacked Cards: Re-initializing unloaded containers');
      initSAAStackedCards();
    }
  }, 500);
});

// Expose utility functions globally for manual control
window.SAAStackedCards = {
  refresh: refreshSAAStackedCards,
  init: initSAAStackedCards,
  setupCards: setupStackedCards
};

// Export for module usage (commented out for regular script loading)
// export { initSAAStackedCards, refreshSAAStackedCards };