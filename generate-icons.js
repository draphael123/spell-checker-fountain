/**
 * Fountain Spell Checker - Icon Generator
 * Run this script to generate PNG icons from the SVG sources
 * 
 * Usage: 
 *   1. Open icons/generate-icons.html in Chrome
 *   2. Click "Download All Icons"
 *   3. Move downloaded PNGs to the icons/ folder
 * 
 * OR if you have Node.js with canvas installed:
 *   npm install canvas
 *   node generate-icons.js
 */

try {
  const { createCanvas } = require('canvas');
  const fs = require('fs');
  const path = require('path');

  function drawIcon(ctx, size) {
    // Background gradient circle
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#4a9eff');
    gradient.addColorStop(1, '#7b68ee');
    
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 1, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw sparkle
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = size * 0.05;
    
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.35;
    
    // Main 4-point star
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx + r*0.15, cy - r*0.15, cx + r, cy);
    ctx.quadraticCurveTo(cx + r*0.15, cy + r*0.15, cx, cy + r);
    ctx.quadraticCurveTo(cx - r*0.15, cy + r*0.15, cx - r, cy);
    ctx.quadraticCurveTo(cx - r*0.15, cy - r*0.15, cx, cy - r);
    ctx.fill();
    
    // Small sparkle dots (only for larger sizes)
    if (size >= 48) {
      const dotSize = size * 0.04;
      const positions = [
        [0.25, 0.25], [0.75, 0.25],
        [0.25, 0.75], [0.75, 0.75]
      ];
      
      positions.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(size * px, size * py, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // Generate each icon size
  [16, 48, 128].forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    drawIcon(ctx, size);
    
    const buffer = canvas.toBuffer('image/png');
    const filepath = path.join(__dirname, 'icons', `icon${size}.png`);
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Generated ${filepath}`);
  });

  console.log('\n✨ All icons generated successfully!');
  
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  📦 Canvas module not found                                  ║
║                                                              ║
║  To generate icons, please use one of these methods:         ║
║                                                              ║
║  METHOD 1: Browser (Recommended)                             ║
║  ─────────────────────────────────────────────────────────   ║
║  1. Open icons/generate-icons.html in Chrome                 ║
║  2. Click "Download All Icons"                               ║
║  3. Move the downloaded PNGs to the icons/ folder            ║
║                                                              ║
║  METHOD 2: Node.js with canvas                               ║
║  ─────────────────────────────────────────────────────────   ║
║  1. Run: npm install canvas                                  ║
║  2. Run: node generate-icons.js                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
  } else {
    console.error('Error:', e.message);
  }
}

