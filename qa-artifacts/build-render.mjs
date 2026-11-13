import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

await build({
  entryPoints: [path.join(here, 'render-entry.jsx')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  outfile: path.join(here, '.build', 'render.cjs'),
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react-dom/server'],
  logLevel: 'info',
  absWorkingDir: root,
});
