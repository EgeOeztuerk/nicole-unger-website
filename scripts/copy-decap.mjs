/**
 * Kopiert Decap CMS aus node_modules nach public/admin/vendor, damit auch der
 * Admin-Bereich ohne externes CDN auskommt. Läuft automatisch vor dev/build.
 */
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const src = 'node_modules/decap-cms/dist';
const dest = 'public/admin/vendor';

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const files = readdirSync(src).filter(
  (f) => f === 'decap-cms.js' || /\.decap-cms\.js$/.test(f) || f.endsWith('.wasm') || f === 'decap-cms.js.LICENSE.txt',
);
for (const file of files) cpSync(join(src, file), join(dest, file));
console.log(`Decap CMS: ${files.length} Dateien nach ${dest} kopiert.`);
