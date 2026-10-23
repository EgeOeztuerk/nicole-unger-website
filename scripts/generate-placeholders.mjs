/**
 * Erzeugt neutrale Platzhalterbilder (src/assets/uploads) und kurze
 * Platzhalter-Hörproben (public/audio). Nur einmalig nötig – die echten Medien
 * ersetzt Nicole später über das CMS.  Aufruf: npm run placeholders
 * Bestehende Dateien werden nicht überschrieben (Option --force).
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const force = process.argv.includes('--force');
const imgDir = 'src/assets/uploads';
const audioDir = 'public/audio';
mkdirSync(imgDir, { recursive: true });
mkdirSync(audioDir, { recursive: true });

const tones = [
  ['#2F5361', '#9DB3B8'],
  ['#3B3F42', '#B9B1A4'],
  ['#5A6B6E', '#E4DDD1'],
  ['#26292B', '#7C8E91'],
  ['#6E625A', '#D9CFC2'],
  ['#41545A', '#C9D1CF'],
];

/** Weiche Verlaufsfläche mit abstrakter Figur und dezentem Label. */
function svg(w, h, label, i, figure = true) {
  const [a, b] = tones[i % tones.length];
  const r = Math.min(w, h);
  const cx = w * (0.38 + (i % 3) * 0.12);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/>
    </linearGradient>
    <radialGradient id="l" cx="${cx / w}" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#l)"/>
  ${
    figure
      ? `<g fill="${a}" fill-opacity=".45">
    <circle cx="${cx}" cy="${h * 0.42}" r="${r * 0.13}"/>
    <path d="M ${cx - r * 0.3} ${h} C ${cx - r * 0.28} ${h * 0.68}, ${cx + r * 0.28} ${h * 0.68}, ${cx + r * 0.3} ${h} Z"/>
  </g>`
      : ''
  }
  <text x="${w - r * 0.05}" y="${h - r * 0.05}" text-anchor="end" font-family="Georgia, serif" font-style="italic"
    font-size="${Math.round(r * 0.045)}" fill="#fff" fill-opacity=".8">${label}</text>
</svg>`;
}

const images = [
  ['hero-1.jpg', 2400, 1500, 'Platzhalter · Hero 1'],
  ['hero-2.jpg', 2400, 1500, 'Platzhalter · Hero 2'],
  ['hero-3.jpg', 2400, 1500, 'Platzhalter · Hero 3'],
  ['kachel-schauspiel.jpg', 1200, 1500, 'Platzhalter · Schauspiel'],
  ['kachel-stoffe.jpg', 1200, 1500, 'Platzhalter · Stoffentwicklung'],
  ['kachel-stories.jpg', 1200, 1500, 'Platzhalter · Stories'],
  ['headshot-1.jpg', 1200, 1500, 'Platzhalter · Headshot 1'],
  ['headshot-2.jpg', 1200, 1500, 'Platzhalter · Headshot 2'],
  ['headshot-3.jpg', 1200, 1500, 'Platzhalter · Headshot 3'],
  ['headshot-4.jpg', 1200, 1500, 'Platzhalter · Szenenbild 1'],
  ['headshot-5.jpg', 1200, 1500, 'Platzhalter · Szenenbild 2'],
  ['headshot-6.jpg', 1200, 1500, 'Platzhalter · Porträt'],
  ['showreel-poster.jpg', 1920, 1080, 'Platzhalter · Showreel'],
  ['sprechen.jpg', 1600, 1100, 'Platzhalter · Studio'],
  ['dramaturgie.jpg', 1200, 1500, 'Platzhalter · Schreibtisch', false],
  ['portrait.jpg', 1200, 1500, 'Platzhalter · Porträt'],
  ['story-1.jpg', 1200, 800, 'Platzhalter · Drehbuch', false],
  ['story-2.jpg', 1200, 800, 'Platzhalter · Roman', false],
];

let n = 0;
for (const [i, [name, w, h, label, figure]] of images.entries()) {
  const out = join(imgDir, name);
  if (existsSync(out) && !force) continue;
  await sharp(Buffer.from(svg(w, h, label, i, figure !== false)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  n++;
}

/** Kurzer, leiser Akkord als WAV (Mono, 22,05 kHz, 16 Bit) mit Ein-/Ausblende. */
function wav(seconds, freqs) {
  const rate = 22050;
  const len = Math.floor(seconds * rate);
  const buf = Buffer.alloc(44 + len * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + len * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(len * 2, 40);
  for (let i = 0; i < len; i++) {
    const t = i / rate;
    const env = Math.min(1, t / 0.6, (seconds - t) / 1.2);
    let v = 0;
    for (const [k, f] of freqs.entries()) v += Math.sin(2 * Math.PI * f * t) * (0.5 / (k + 1));
    buf.writeInt16LE(Math.round(v * env * 0.25 * 32767), 44 + i * 2);
  }
  return buf;
}

const sounds = [
  ['hoerbuch-mystery.wav', 9, [220, 261.6, 329.6]],
  ['hoerbuch-lyrik.wav', 7, [196, 246.9, 293.7]],
  ['synchron-de.wav', 6, [246.9, 311.1, 370]],
  ['synchron-fr.wav', 6, [261.6, 329.6, 392]],
  ['werbung-spot.wav', 5, [293.7, 370, 440]],
  ['doku-sprecherin.wav', 8, [174.6, 220, 261.6]],
];
for (const [name, sec, freqs] of sounds) {
  const out = join(audioDir, name);
  if (existsSync(out) && !force) continue;
  writeFileSync(out, wav(sec, freqs));
  n++;
}

console.log(`Platzhalter erzeugt: ${n} Datei(en).`);
