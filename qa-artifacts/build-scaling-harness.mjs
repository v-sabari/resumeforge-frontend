import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

await build({
  entryPoints: [path.join(here, 'preview-scaling-harness.jsx')],
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: 'chrome120',
  outfile: path.join(here, '.build', 'preview-scaling-harness.js'),
  jsx: 'automatic',
  loader: { '.jsx': 'jsx' },
  define: {
    'process.env.NODE_ENV': '"production"',
    'import.meta.env': '{}',
  },
  logLevel: 'info',
  absWorkingDir: root,
});
