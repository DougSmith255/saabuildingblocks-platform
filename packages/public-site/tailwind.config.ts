import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS v4 Configuration for Public Site
 */

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../shared/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        amulya: ['var(--font-amulya)', 'system-ui', 'sans-serif'],
        taskor: ['var(--font-taskor)', 'system-ui', 'sans-serif'],
        synonym: ['var(--font-synonym)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
