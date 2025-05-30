const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'favicon.ico': [16, 32],
  'icon.png': [32],
  'apple-icon.png': [180],
  'icon-192x192.png': [192],
  'icon-512x512.png': [512]
};

async function generateFavicons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'));
  
  for (const [filename, dimensions] of Object.entries(sizes)) {
    const outputPath = path.join(__dirname, '../public', filename);
    
    if (filename === 'favicon.ico') {
      // Generate multiple sizes for favicon.ico
      const pngBuffers = await Promise.all(
        dimensions.map(size =>
          sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toBuffer()
        )
      );
      
      // Use the 32x32 version as favicon.ico
      await sharp(pngBuffers[1])
        .toFile(outputPath);
    } else {
      // Generate PNG files
      await sharp(svgBuffer)
        .resize(dimensions[0], dimensions[0])
        .png()
        .toFile(outputPath);
    }
    
    console.log(`Generated ${filename}`);
  }
}

generateFavicons().catch(console.error); 