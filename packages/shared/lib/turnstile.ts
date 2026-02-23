/**
 * Cloudflare Turnstile (invisible mode) helper.
 * Loads the script once and provides a function to get a fresh token before each form submit.
 */

const TURNSTILE_SITE_KEY = '0x4AAAAAACgEEzOh7Es9ADzy';
const SCRIPT_ID = 'cf-turnstile-script';

let scriptLoaded = false;
let loadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        action?: string;
        size?: string;
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

function loadScript(): Promise<void> {
  if (scriptLoaded && window.turnstile) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      // Script tag exists but may not be ready yet
      if (window.turnstile) {
        scriptLoaded = true;
        resolve();
        return;
      }
      // Wait for it to initialize
      const check = setInterval(() => {
        if (window.turnstile) {
          clearInterval(check);
          scriptLoaded = true;
          resolve();
        }
      }, 50);
      setTimeout(() => { clearInterval(check); reject(new Error('Turnstile timeout')); }, 5000);
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      // turnstile may not be immediately available after script load
      const check = setInterval(() => {
        if (window.turnstile) {
          clearInterval(check);
          scriptLoaded = true;
          resolve();
        }
      }, 50);
      setTimeout(() => { clearInterval(check); reject(new Error('Turnstile init timeout')); }, 5000);
    };
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Get a Turnstile token for form submission.
 * Loads the script on first call, renders invisible widget, returns token via callback.
 */
export async function getTurnstileToken(action?: string): Promise<string> {
  await loadScript();

  if (!window.turnstile) {
    throw new Error('Turnstile not available');
  }

  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Turnstile challenge timeout'));
    }, 10000);

    let widgetId: string | undefined;

    const cleanup = () => {
      clearTimeout(timeoutId);
      if (widgetId && window.turnstile) {
        try { window.turnstile.remove(widgetId); } catch {}
      }
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };

    widgetId = window.turnstile!.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      size: 'invisible',
      action,
      callback: (token: string) => {
        cleanup();
        resolve(token);
      },
      'error-callback': () => {
        cleanup();
        reject(new Error('Turnstile challenge failed'));
      },
      'expired-callback': () => {
        cleanup();
        reject(new Error('Turnstile token expired'));
      },
    });
  });
}
