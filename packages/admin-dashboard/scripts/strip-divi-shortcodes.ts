#!/usr/bin/env tsx
/**
 * Strip Divi shortcodes from HTML content and output clean HTML
 * Usage: tsx strip-divi-shortcodes.ts < input.html > output.html
 * Or: tsx strip-divi-shortcodes.ts --file input.html
 */

import * as fs from 'fs';
import * as readline from 'readline';

function stripDiviShortcodes(html: string): string {
  let result = html;

  // Remove all Divi shortcode tags (opening, closing, and self-closing)
  // Pattern matches [et_pb_*] and [/et_pb_*] with all attributes
  result = result.replace(/\[et_pb_[^\]]*\]/g, '');
  result = result.replace(/\[\/et_pb_[^\]]*\]/g, '');

  // Remove other common Divi/WordPress shortcodes
  result = result.replace(/\[\/?(vc_|fusion_|divi_|elementor-)[^\]]*\]/g, '');

  // Clean up excessive whitespace and empty paragraphs
  result = result.replace(/<p>\s*<\/p>/g, '');
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.trim();

  return result;
}

async function main() {
  const args = process.argv.slice(2);

  let input: string;

  if (args.includes('--file') && args.indexOf('--file') + 1 < args.length) {
    const filePath = args[args.indexOf('--file') + 1];
    input = fs.readFileSync(filePath, 'utf-8');
  } else if (!process.stdin.isTTY) {
    // Read from stdin
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    const lines: string[] = [];
    for await (const line of rl) {
      lines.push(line);
    }
    input = lines.join('\n');
  } else {
    console.error('Usage: tsx strip-divi-shortcodes.ts < input.html');
    console.error('   or: tsx strip-divi-shortcodes.ts --file input.html');
    process.exit(1);
  }

  const cleaned = stripDiviShortcodes(input);
  console.log(cleaned);
}

main().catch(console.error);
