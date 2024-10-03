// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

// Define the Git hooks directory and pre-commit hook path
const hooksDir = path.join('.git', 'hooks')
const preCommitHook = path.join(hooksDir, 'pre-commit')
const prePushHook = path.join(hooksDir, 'pre-push')

// Ensure the hooks directory exists
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true })
}

// Shell script to detect package manager and run the build
const hookContent = `#!/bin/sh
# Detect the package manager

if command -v bun >/dev/null 2>&1; then
  echo "Using Bun to build..."
  bun run build
elif command -v yarn >/dev/null 2>&1; then
  echo "Using Yarn to build..."
  yarn run build
elif command -v pnpm >/dev/null 2>&1; then
  echo "Using PNPM to build..."
  pnpm run build
else
  echo "Using NPM to build..."
  npm run build
fi

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Commit aborted."
  exit 1
fi

echo "Build succeeded."
`

// Write the pre-commit hook to the file system
fs.writeFileSync(preCommitHook, hookContent, { mode: 0o755 })
console.log('Pre-commit hook installed successfully.')
fs.writeFileSync(prePushHook, hookContent, { mode: 0o755 })
console.log('Pre-push hook installed successfully.')
