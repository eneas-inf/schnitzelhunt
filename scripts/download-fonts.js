/**
 * Dieses Skript lädt die MapLibre-GL PBF-Schriftdateien einmalig herunter
 * und speichert sie lokal unter src/assets/openstreetmap/fonts/
 *
 * Ausführen mit: node scripts/download-fonts.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BASE_URL = 'https://tiles.openfreemap.org/fonts';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'openstreetmap', 'fonts');
const FORCE = process.argv.includes('--force');

// Nur die eine Schrift, auf die wir alle Layer normalisiert haben
const FONT = 'Noto Sans Regular';

// Unicode-Ranges die MapLibre für europäische + lateinische Zeichen benötigt
// Format: [start, end] in 256er-Schritten
const RANGES = [];
for (let i = 0; i <= 65280; i += 256) {
  RANGES.push([i, i + 255]);
}

function decodeBody(buffer, contentEncoding) {
  if (!contentEncoding) {
    return buffer;
  }
  const enc = String(contentEncoding).toLowerCase();
  if (enc.includes('gzip')) {
    return zlib.gunzipSync(buffer);
  }
  if (enc.includes('br')) {
    return zlib.brotliDecompressSync(buffer);
  }
  if (enc.includes('deflate')) {
    return zlib.inflateSync(buffer);
  }
  return buffer;
}

function assertGlyphPayload(buffer, url) {
  if (!buffer || buffer.length < 8) {
    throw new Error(`Invalid glyph payload (too small) for ${url}`);
  }
  const prefix = buffer.subarray(0, 16).toString('utf8').toLowerCase();
  if (prefix.startsWith('<!doctype') || prefix.startsWith('<html')) {
    throw new Error(`Invalid glyph payload (HTML) for ${url}`);
  }
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, {recursive: true});

    https.get(url, (response) => {
      if (response.statusCode === 404) {
        resolve(false);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        try {
          const raw = Buffer.concat(chunks);
          const decoded = decodeBody(raw, response.headers['content-encoding']);
          assertGlyphPayload(decoded, url);
          fs.writeFileSync(dest, decoded);
          resolve(true);
        } catch (err) {
          try {
            fs.unlinkSync(dest);
          } catch (e) {
          }
          reject(err);
        }
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Downloading PBF font files for "${FONT}"...`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Force re-download: ${FORCE}`);

  const fontDir = path.join(OUTPUT_DIR, FONT);
  fs.mkdirSync(fontDir, {recursive: true});

  let downloaded = 0;
  let skipped = 0;

  for (const [start, end] of RANGES) {
    const range = `${start}-${end}`;
    const dest = path.join(fontDir, `${range}.pbf`);

    // Bereits vorhandene Dateien überspringen
    if (!FORCE && fs.existsSync(dest)) {
      skipped++;
      continue;
    }

    const url = `${BASE_URL}/${encodeURIComponent(FONT)}/${range}.pbf`;

    try {
      const success = await downloadFile(url, dest);
      if (success) {
        downloaded++;
        if (downloaded % 10 === 0) {
          console.log(`  Downloaded ${downloaded} ranges so far (skipped ${skipped})...`);
        }
      } else {
        // 404 – Range existiert nicht (oberer Unicode-Bereich)
        skipped++;
      }
    } catch (err) {
      console.error(`  Error downloading ${url}:`, err.message);
    }
  }

  console.log(`\nDone! Downloaded: ${downloaded}, Skipped/Not found: ${skipped}`);
  console.log(`\nFont files are stored in: ${OUTPUT_DIR}`);
}

main().catch(console.error);
