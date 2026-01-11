/**
 * Script to extract the BuiltForFuture section and convert to vanilla JS/HTML
 * for use in the [slug].js Cloudflare Function
 */

const fs = require('fs');
const path = require('path');

// Read the React component
const componentPath = path.join(__dirname, '../app/components/sections/BuiltForFuture.tsx');
const componentCode = fs.readFileSync(componentPath, 'utf-8');

console.log('=== BUILT FOR FUTURE SECTION - VANILLA JS/HTML CONVERSION ===\n');

// Extract the constants
const BRAND_YELLOW = '#ffd700';

const FUTURE_POINTS = [
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-cloud/public', text: "Cloud-First Brokerage Model", imgClass: "w-full h-full object-contain", imgStyle: {}, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-ai-bot/public', text: "AI-Powered Tools and Training", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.25) translate(10px, 18px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-mobile-first/public', text: "Mobile-First Workflows", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(0.95) translate(3px, 10px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-borderless/public', text: "Borderless Business", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.15) translate(-1px, -1px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-income-benjamins/public', text: "Sustainable Income Beyond Sales", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.35) translateX(5px)' }, bgColor: '#111' },
];

// Helper to convert style object to CSS string
function styleToString(styleObj) {
  if (!styleObj || Object.keys(styleObj).length === 0) return '';
  return Object.entries(styleObj)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

// Generate the HTML section
console.log('=== HTML SECTION ===\n');

const html = `    <!-- Built for Where Real Estate Is Going - Horizontal Scroll Cards -->
    <section class="relative pt-16 md:pt-24" id="built-for-future">
      <!-- Fixed background animation - outside pinned content -->
      <div class="absolute inset-0 overflow-hidden" style="z-index: 0;">
        <!-- GrayscaleDataStream will be rendered here by JS -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden" id="grayscale-data-stream" style="z-index: 0;"></div>
      </div>

      <!-- Invisible wrapper that gets pinned -->
      <div class="relative" id="built-future-trigger" style="z-index: 1;">
        <!-- Content - animates upward -->
        <div class="relative" id="built-future-content" style="transform: translateY(30px);">
          <!-- Section Header -->
          <div class="text-center mb-4 px-6">
            <h2 class="text-h2 h2-container" style="max-width: 100%;">
              <span class="h2-word">Built</span>
              <span class="h2-word">for</span>
              <span class="h2-word">Where</span>
              <span class="h2-word">Real</span>
              <span class="h2-word">Estate</span>
              <span class="h2-word">Is</span>
              <span class="h2-word">Going</span>
            </h2>
          </div>
          <p class="text-body opacity-70 mb-12 text-center max-w-2xl mx-auto px-6">The future of real estate is cloud-based, global, and technology-driven. SAA is already there.</p>

          <!-- Horizontal Scroll Cards Container with Portal Edges -->
          <div class="relative">
            <!-- 3D Curved Portal Edges - raised bars that cards slide under -->
            <!-- Left curved bar -->
            <div class="absolute left-0 z-20 pointer-events-none" style="top: -40px; bottom: -40px; width: 12px; border-radius: 0 12px 12px 0; background: linear-gradient(90deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%); border-right: 1px solid rgba(255,190,0,0.3); box-shadow: 3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3); transform: perspective(500px) rotateY(-3deg); transform-origin: right center;"></div>
            <!-- Right curved bar -->
            <div class="absolute right-0 z-20 pointer-events-none" style="top: -40px; bottom: -40px; width: 12px; border-radius: 12px 0 0 12px; background: linear-gradient(270deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%); border-left: 1px solid rgba(255,190,0,0.3); box-shadow: -3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3); transform: perspective(500px) rotateY(3deg); transform-origin: left center;"></div>

            <!-- Inner container - clips cards horizontally at inner edge of bars, but allows vertical overflow for glow -->
            <div class="relative" style="margin-left: 12px; margin-right: 12px; overflow-x: clip; overflow-y: visible;">
              <!-- Cards track -->
              <div class="py-12">
                <div class="flex" id="built-future-track" style="gap: 24px;">
                  <!-- Cards are generated by JavaScript -->
                </div>
              </div>
            </div>
          </div>

          <!-- 3D Plasma Tube Progress Bar -->
          <div class="flex justify-center mt-8 px-6">
            <div class="w-64 md:w-80 h-3 rounded-full overflow-hidden relative" style="background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%); border: 1px solid rgba(245, 245, 240, 0.25); box-shadow: inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05);">
              <div class="h-full rounded-full" id="built-future-progress" style="width: 0%; background: linear-gradient(180deg, #ffe566 0%, #ffd700 40%, #cc9900 100%); box-shadow: 0 0 8px #ffd700, 0 0 16px #ffd700, 0 0 32px rgba(255,215,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4);"></div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

console.log(html);

// Save HTML to file
fs.writeFileSync('/tmp/built-future-html.txt', html);
console.log('\n\nHTML saved to /tmp/built-future-html.txt');

// Generate the JavaScript
console.log('\n\n=== JAVASCRIPT SECTION ===\n');

const js = `
      // ========================================
      // GrayscaleDataStream - Digital Rain Background
      // Exact copy from BuiltForFuture.tsx GrayscaleDataStream component
      // ========================================
      function initGrayscaleDataStream() {
        var container = document.getElementById('grayscale-data-stream');
        if (!container) {
          console.log('[GrayscaleDataStream] Container not found');
          return;
        }

        var isMobile = window.innerWidth < 768;
        var columnCount = isMobile ? 8 : 20;
        var columnWidth = 100 / columnCount;

        // Create column configs - exact from React useMemo
        var columnConfigs = [];
        for (var i = 0; i < columnCount; i++) {
          columnConfigs.push({
            x: i * columnWidth,
            speed: 0.8 + (i % 4) * 0.4,
            offset: (i * 17) % 100
          });
        }

        var timeRef = 0;
        var scrollSpeedRef = 1;
        var lastScrollY = 0;
        var BASE_SPEED = 0.00028;
        var lastTimestamp = 0;
        var numChars = 22;

        // Scroll speed boost handler
        window.addEventListener('scroll', function() {
          var currentY = window.scrollY;
          var scrollDelta = Math.abs(currentY - lastScrollY);
          lastScrollY = currentY;
          scrollSpeedRef = 1 + Math.min(scrollDelta * 0.05, 3);
        }, { passive: true });

        // getChar function - exact from React
        function getChar(colIndex, charIndex) {
          var flipRate = 0.6 + (colIndex % 3) * 0.3;
          var charSeed = Math.floor(timeRef * 15 * flipRate + colIndex * 7 + charIndex * 13);
          return charSeed % 2 === 0 ? '0' : '1';
        }

        // Create column elements with characters
        columnConfigs.forEach(function(col, i) {
          var colDiv = document.createElement('div');
          colDiv.className = 'absolute';
          colDiv.style.left = col.x + '%';
          colDiv.style.top = '0';
          colDiv.style.width = columnWidth + '%';
          colDiv.style.height = '100%';
          colDiv.style.overflow = 'hidden';
          colDiv.style.fontFamily = 'monospace';
          colDiv.style.fontSize = '14px';
          colDiv.style.lineHeight = '1.4';
          colDiv.dataset.colIndex = i;
          colDiv.dataset.speed = col.speed;
          colDiv.dataset.offset = col.offset;

          for (var j = 0; j < numChars; j++) {
            var charDiv = document.createElement('div');
            charDiv.style.position = 'absolute';
            charDiv.dataset.charIndex = j;
            charDiv.textContent = getChar(i, j);
            colDiv.appendChild(charDiv);
          }

          container.appendChild(colDiv);
        });

        // Animation loop - exact logic from React useEffect
        function animate(timestamp) {
          var deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
          lastTimestamp = timestamp;
          timeRef += BASE_SPEED * deltaTime * scrollSpeedRef;
          scrollSpeedRef = Math.max(1, scrollSpeedRef * 0.95);

          var columns = container.querySelectorAll('[data-col-index]');
          columns.forEach(function(colDiv) {
            var i = parseInt(colDiv.dataset.colIndex);
            var speed = parseFloat(colDiv.dataset.speed);
            var offset = parseFloat(colDiv.dataset.offset);
            var columnOffset = (timeRef * speed * 60 + offset) % 110;
            var headPosition = (columnOffset / 5) % numChars;

            var chars = colDiv.querySelectorAll('[data-char-index]');
            chars.forEach(function(charDiv) {
              var j = parseInt(charDiv.dataset.charIndex);
              var baseY = j * 5;
              var charY = (baseY + columnOffset) % 110 - 10;
              var distanceFromHead = (j - headPosition + numChars) % numChars;
              var isHead = distanceFromHead === 0;
              var trailBrightness = isHead ? 1 : Math.max(0, 1 - distanceFromHead * 0.08);
              var edgeFade = charY < 12 ? Math.max(0, charY / 12) : charY > 88 ? Math.max(0, (100 - charY) / 12) : 1;
              var headColor = 'rgba(180,180,180,' + (0.4 * edgeFade) + ')';
              var trailColor = 'rgba(120,120,120,' + (trailBrightness * 0.25 * edgeFade) + ')';

              charDiv.style.top = charY + '%';
              charDiv.style.color = isHead ? headColor : trailColor;
              charDiv.style.textShadow = isHead ? '0 0 6px rgba(150,150,150,' + (0.3 * edgeFade) + ')' : '0 0 2px rgba(100,100,100,' + (0.1 * edgeFade) + ')';
              charDiv.style.opacity = edgeFade;
              charDiv.textContent = getChar(i, j);
            });
          });

          requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
        console.log('[GrayscaleDataStream] Initialized with ' + columnCount + ' columns');
      }

      // ========================================
      // Built For Future - Horizontal Scroll Cards
      // Exact copy from BuiltForFuture.tsx BuiltForFuture component
      // ========================================
      function setupBuiltForFutureScrollAnimation() {
        var trigger = document.getElementById('built-future-trigger');
        var content = document.getElementById('built-future-content');
        var track = document.getElementById('built-future-track');
        var progressBar = document.getElementById('built-future-progress');

        if (!trigger || !content || !track) {
          console.log('[BuiltForFuture] Elements not found, skipping');
          return;
        }

        var BRAND_YELLOW = '#ffd700';

        // FUTURE_POINTS - exact from React
        var FUTURE_POINTS = [
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-cloud/public', text: 'Cloud-First Brokerage Model', imgClass: 'w-full h-full object-contain', imgStyle: '', bgColor: 'rgba(17,17,17,0.5)' },
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-ai-bot/public', text: 'AI-Powered Tools and Training', imgClass: 'w-full h-full object-cover', imgStyle: 'transform: scale(1.25) translate(10px, 18px);', bgColor: 'rgba(17,17,17,0.5)' },
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-mobile-first/public', text: 'Mobile-First Workflows', imgClass: 'w-full h-full object-cover', imgStyle: 'transform: scale(0.95) translate(3px, 10px);', bgColor: 'rgba(17,17,17,0.5)' },
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-borderless/public', text: 'Borderless Business', imgClass: 'w-full h-full object-cover', imgStyle: 'transform: scale(1.15) translate(-1px, -1px);', bgColor: 'rgba(17,17,17,0.5)' },
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-income-benjamins/public', text: 'Sustainable Income Beyond Sales', imgClass: 'w-full h-full object-cover', imgStyle: 'transform: scale(1.35) translateX(5px);', bgColor: '#111' }
        ];

        var totalCards = FUTURE_POINTS.length;

        // Responsive - exact from React
        var isMobile = window.innerWidth < 640;
        var CARD_WIDTH = isMobile ? 280 : 560;
        var CARD_GAP = isMobile ? 16 : 24;

        // Grace periods - exact from React
        var GRACE = 0.1;
        var CONTENT_RANGE = 1 - (GRACE * 2);

        // Magnetic snap state - exact from React refs
        var rawPositionRef = 0;
        var displayPositionRef = 0;
        var lastRawRef = 0;
        var velocityRef = 0;

        // Create looped cards array - exact from React
        var loopedCards = FUTURE_POINTS.slice(-2).concat(FUTURE_POINTS).concat(FUTURE_POINTS.slice(0, 2));

        // Active/inactive backgrounds - exact from React
        var activeBackground = 'radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%), radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%), radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%), linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)';
        var inactiveBackground = 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))';

        // Set track gap
        track.style.gap = CARD_GAP + 'px';

        // Generate cards HTML - exact structure from React JSX
        loopedCards.forEach(function(point, loopIndex) {
          var wrapper = document.createElement('div');
          wrapper.className = 'flex-shrink-0';
          wrapper.style.width = CARD_WIDTH + 'px';
          wrapper.style.transition = 'transform 0.1s ease-out, filter 0.15s ease-out, opacity 0.15s ease-out';
          wrapper.dataset.loopIndex = loopIndex;

          var card = document.createElement('div');
          card.className = 'p-8 rounded-2xl min-h-[380px] flex flex-col items-center justify-center relative overflow-hidden';
          card.style.transition = 'background 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out';
          card.dataset.card = 'true';

          var imgContainer = document.createElement('div');
          imgContainer.className = 'w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full mb-6 flex items-center justify-center overflow-hidden relative z-10';
          imgContainer.style.transition = 'background-color 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out';
          imgContainer.dataset.imgContainer = 'true';

          var img = document.createElement('img');
          img.src = point.image;
          img.alt = point.text;
          img.className = point.imgClass;
          if (point.imgStyle) {
            img.style.cssText = point.imgStyle;
          }

          var title = document.createElement('h3');
          title.className = 'text-h5 font-bold text-center relative z-10';
          title.style.transition = 'color 0.2s ease-out';
          title.textContent = point.text;
          title.dataset.title = 'true';

          imgContainer.appendChild(img);
          card.appendChild(imgContainer);
          card.appendChild(title);
          wrapper.appendChild(card);
          track.appendChild(wrapper);
        });

        var wrappers = track.querySelectorAll('[data-loop-index]');

        // updateCards function - renders card states based on scroll position
        function updateCards(scrollPosition) {
          var progress = scrollPosition / (totalCards - 1);
          if (progressBar) {
            progressBar.style.width = (progress * 100) + '%';
          }

          // Track transform - exact formula from React
          var offset = (scrollPosition + 2) * (CARD_WIDTH + CARD_GAP);
          track.style.transform = 'translateX(calc(50vw - ' + (CARD_WIDTH / 2) + 'px - 12px - ' + offset + 'px))';

          wrappers.forEach(function(wrapper) {
            var loopIndex = parseInt(wrapper.dataset.loopIndex);
            var card = wrapper.querySelector('[data-card]');
            var imgContainer = wrapper.querySelector('[data-img-container]');
            var title = wrapper.querySelector('[data-title]');

            var actualIndex = loopIndex - 2;
            var distance = Math.abs(scrollPosition - actualIndex);
            var isActive = distance < 0.5;

            // Scale - exact from React
            var scale = Math.max(0.85, 1 - distance * 0.1);

            // Blur - exact from React
            var blurAmount = Math.min(5, distance * 10);

            // Blackout for looped cards - exact from React
            var blackoutOpacity = 0;
            if (actualIndex < 0) {
              blackoutOpacity = Math.max(0, 1 - scrollPosition);
            } else if (actualIndex > totalCards - 1) {
              blackoutOpacity = Math.max(0, (scrollPosition - (totalCards - 2)) / 1);
            }

            // Apply wrapper styles - exact from React
            wrapper.style.transform = 'scale(' + scale + ')';
            wrapper.style.filter = 'blur(' + (blurAmount + blackoutOpacity * 4) + 'px) grayscale(' + (blackoutOpacity * 100) + '%) brightness(' + (1 - blackoutOpacity * 0.6) + ')';
            wrapper.style.opacity = 1 - blackoutOpacity * 0.4;

            // Card styles - exact from React
            card.style.background = isActive ? activeBackground : inactiveBackground;
            card.style.border = isActive ? '2px solid rgba(180,150,50,0.5)' : '2px solid ' + BRAND_YELLOW + '22';
            card.style.boxShadow = isActive ? '0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25)' : 'none';

            // Image container styles - exact from React
            if (imgContainer) {
              imgContainer.style.backgroundColor = isActive ? 'rgba(20,18,12,0.85)' : loopedCards[loopIndex].bgColor;
              imgContainer.style.border = isActive ? '3px solid rgba(40,35,20,0.8)' : '3px solid ' + BRAND_YELLOW;
              imgContainer.style.boxShadow = isActive ? '0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2)' : 'none';
            }

            // Title color - exact from React
            if (title) {
              title.style.color = isActive ? '#2a2a2a' : '#e5e4dd';
            }
          });
        }

        // Magnetic animation loop - exact from React useLayoutEffect
        function animateMagnetic() {
          var raw = rawPositionRef;
          var lastRaw = lastRawRef;
          var currentDisplay = displayPositionRef;

          var instantVelocity = Math.abs(raw - lastRaw);
          velocityRef = velocityRef * 0.9 + instantVelocity * 0.1;
          lastRawRef = raw;

          var nearestCard = Math.round(raw);
          var clampedTarget = Math.max(0, Math.min(totalCards - 1, nearestCard));

          var velocityFactor = Math.min(1, velocityRef * 50);
          var targetPosition = clampedTarget * (1 - velocityFactor) + raw * velocityFactor;
          var newPosition = currentDisplay + (targetPosition - currentDisplay) * 0.15;

          if (Math.abs(newPosition - currentDisplay) > 0.001) {
            displayPositionRef = newPosition;
            updateCards(newPosition);
          }

          requestAnimationFrame(animateMagnetic);
        }

        requestAnimationFrame(animateMagnetic);

        // GSAP ScrollTrigger - exact from React
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
          trigger: trigger,
          start: 'center center',
          end: '+=300%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: function(self) {
            var cardPosition = 0;

            if (self.progress <= GRACE) {
              cardPosition = 0;
            } else if (self.progress >= 1 - GRACE) {
              cardPosition = totalCards - 1;
            } else {
              var contentProgress = (self.progress - GRACE) / CONTENT_RANGE;
              cardPosition = contentProgress * (totalCards - 1);
            }

            rawPositionRef = cardPosition;
          }
        });

        // Y drift animation - exact from React
        gsap.to(content, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: trigger,
            start: 'center center',
            end: '+=300%',
            scrub: 2.5
          }
        });

        // Initialize at position 0
        updateCards(0);
        console.log('[BuiltForFuture] Initialized with ' + loopedCards.length + ' looped cards');
      }
`;

console.log(js);

// Save JS to file
fs.writeFileSync('/tmp/built-future-js.txt', js);
console.log('\n\nJS saved to /tmp/built-future-js.txt');

console.log('\n\n=== INSTRUCTIONS ===');
console.log('1. Replace the HTML section in [slug].js with contents of /tmp/built-future-html.txt');
console.log('2. Replace the JS functions in [slug].js with contents of /tmp/built-future-js.txt');
console.log('3. Make sure initGrayscaleDataStream() and setupBuiltForFutureScrollAnimation() are called in init');
