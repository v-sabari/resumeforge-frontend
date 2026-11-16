/**
 * qa-artifacts/build-app-css.mjs
 *
 * Builds the harness stylesheet (qa-artifacts/.build/app.css) from the app's
 * real Tailwind entry (src/index.css + tailwind.config.js), so the browser
 * harnesses render the production utility classes exactly as Vite would.
 *
 * Kept unminified to match the shape the drivers were validated against.
 *
 * Usage: node qa-artifacts/build-app-css.mjs
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const cli = path.join(root, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
const result = spawnSync(
  process.execPath,
  [
    cli,
    '-c', path.join(root, 'tailwind.config.js'),
    '-i', path.join(root, 'src', 'index.css'),
    '-o', path.join(here, '.build', 'app.css'),
  ],
  { stdio: 'inherit', cwd: root },
);

process.exit(result.status ?? 1);
