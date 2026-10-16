const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, r, g, b) {
  const IHDR = Buffer.alloc(13);
  IHDR.writeUInt32BE(width, 0);
  IHDR.writeUInt32BE(height, 4);
  IHDR[8] = 8; // bit depth
  IHDR[9] = 2; // color type: truecolor (RGB)
  IHDR[10] = 0; // compression
  IHDR[11] = 0; // filter
  IHDR[12] = 0; // interlace

  // Raw image data: for each row, 1 byte filter (0) + width * 3 bytes (RGB)
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      // Distance from center
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.4) {
        // Inner blue circle
        rawData[pixelOffset] = 2;
        rawData[pixelOffset + 1] = 132;
        rawData[pixelOffset + 2] = 199;
      } else if (dist < 0.5) {
        // White border
        rawData[pixelOffset] = 255;
        rawData[pixelOffset + 1] = 255;
        rawData[pixelOffset + 2] = 255;
      } else if (dist < 0.85) {
        // Colored sections
        const angle = Math.atan2(dy, dx);
        if (angle < -0.5) {
          // Red
          rawData[pixelOffset] = 239;
          rawData[pixelOffset + 1] = 68;
          rawData[pixelOffset + 2] = 68;
        } else if (angle < 1.5) {
          // Green
          rawData[pixelOffset] = 34;
          rawData[pixelOffset + 1] = 197;
          rawData[pixelOffset + 2] = 94;
        } else {
          // Yellow
          rawData[pixelOffset] = 245;
          rawData[pixelOffset + 1] = 158;
          rawData[pixelOffset + 2] = 11;
        }
      } else {
        // Dark background
        rawData[pixelOffset] = 32;
        rawData[pixelOffset + 1] = 33;
        rawData[pixelOffset + 2] = 36;
      }
    }
  }

  const IDAT = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    // CRC32
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeInt32BE(crc, 8 + len);
    return buf;
  }

  // Precomputed CRC table
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) | 0;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', IHDR);
  const idatChunk = makeChunk('IDAT', IDAT);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pubDir = path.join(__dirname, '../public');
fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), createPng(192, 192, 32, 33, 36));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), createPng(512, 512, 32, 33, 36));
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 32, 33, 36));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createPng(180, 180, 32, 33, 36));

console.log('Generated PNG icons successfully');
