# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! command -v rg >/dev/null 2>&1; then
  alias rg='/home/claude-flow/.npm/_npx/7cfa166e65244432/node_modules/\@anthropic-ai/claude-code/vendor/ripgrep/x64-linux/rg'
fi
export PATH=/home/claude-flow/.npm/_npx/7cfa166e65244432/node_modules/.bin\:/home/claude-flow/node_modules/.bin\:/home/node_modules/.bin\:/node_modules/.bin\:/usr/lib/node_modules/npm/node_modules/\@npmcli/run-script/lib/node-gyp-bin\:/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/usr/games\:/usr/local/games\:/snap/bin
