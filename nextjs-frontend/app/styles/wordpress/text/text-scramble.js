/**
 * Text Scramble Animation Component
 * Simple version that replaces innerHTML and works reliably
 */

class TextScramble {
    constructor(el) {
        this.el = el;
        // Use user-specified smaller width special characters for scramble effect
        this.chars = '.^/÷?>_';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 60);
            const end = start + Math.floor(Math.random() * 60);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

/**
 * Initialize Text Scramble for all elements with .text-scramble class
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with text-scramble class
    const scrambleElements = document.querySelectorAll('.text-scramble');
    
    scrambleElements.forEach(element => {
        const fx = new TextScramble(element);
        
        // Special handling for hero title with three specific phrases
        if (element.classList.contains('hero-title')) {
            const phrases = [
                "Scale Smarter With Us",
                "Where Agents Win Big", 
                "Skyrocket Your Business"
            ];
            
            let counter = 0;
            
            const next = () => {
                fx.setText(phrases[counter]).then(() => {
                    setTimeout(next, 3000); // 3 second delay between phrases
                });
                counter = (counter + 1) % phrases.length;
            };
            
            // Start the cycling after initial load
            setTimeout(() => {
                next();
            }, 1000);
            
            return; // Skip the standard initialization for hero title
        }
        
        // Standard initialization for other elements
        // Get the text to scramble from data attribute or element text
        const scrambleText = element.dataset.scrambleText || element.innerText;
        
        // Set up the scramble phrases
        const phrases = [scrambleText];
        
        // Check if there are multiple phrases in data attribute
        if (element.dataset.scramblePhrases) {
            try {
                const multiplePhrases = JSON.parse(element.dataset.scramblePhrases);
                phrases.push(...multiplePhrases);
            } catch (e) {
                console.warn('Invalid scramble phrases JSON:', element.dataset.scramblePhrases);
            }
        }
        
        let counter = 0;
        
        const next = () => {
            fx.setText(phrases[counter]).then(() => {
                // Only continue cycling if there are multiple phrases
                if (phrases.length > 1) {
                    setTimeout(next, 2000); // 2 second delay between phrases
                }
            });
            counter = (counter + 1) % phrases.length;
        };
        
        // Start the animation after a brief delay
        setTimeout(() => {
            next();
        }, 500);
        
        // Optional: Re-trigger on hover
        if (element.dataset.scrambleOnHover === 'true') {
            element.addEventListener('mouseenter', () => {
                fx.setText(scrambleText);
            });
        }
    });
});

/**
 * Usage Examples:
 * 
 * <!-- Basic usage - scrambles once on load -->
 * <h1 class="hero-title text-scramble">Scale Smarter With Us</h1>
 * 
 * <!-- Multiple phrases that cycle -->
 * <h2 class="text-scramble" 
 *     data-scramble-text="Smart Agent Alliance"
 *     data-scramble-phrases='["Real Estate Success", "Build Your Empire", "Scale Your Business"]'>
 *     Smart Agent Alliance
 * </h2>
 * 
 * <!-- Scramble on hover -->
 * <p class="text-scramble" 
 *    data-scramble-text="Hover to scramble" 
 *    data-scramble-on-hover="true">
 *     Hover to scramble
 * </p>
 */