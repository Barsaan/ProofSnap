interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

interface VerificationResult {
  isTampered: boolean;
  confidence: number;
  metadata: ImageMetadata;
  analysis: {
    compressionScore: number;
    pixelConsistency: number;
    textAlignment: number;
    metadataScore: number;
  };
}

export async function verifyImage(imageUrl: string): Promise<VerificationResult> {
  // Create an image element to analyze
  const img = new Image();
  img.src = imageUrl;

  // Wait for image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Create a canvas to analyze the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Get image data for analysis
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Analyze compression artifacts
  const compressionScore = analyzeCompression(pixels, canvas.width, canvas.height);

  // Analyze pixel consistency
  const pixelConsistency = analyzePixelConsistency(pixels, canvas.width, canvas.height);

  // Analyze text alignment (basic check for straight lines)
  const textAlignment = analyzeTextAlignment(pixels, canvas.width, canvas.height);

  // Calculate metadata score
  const metadataScore = calculateMetadataScore({
    width: img.width,
    height: img.height,
    format: imageUrl.split('.').pop()?.toLowerCase() || 'unknown',
    size: 0, // We don't have access to actual file size here
  });

  // Calculate overall confidence
  const confidence = Math.round(
    (compressionScore + pixelConsistency + textAlignment + metadataScore) / 4
  );

  // Determine if image is likely tampered - adjusted threshold for WhatsApp screenshots
  const isTampered = confidence < 50; // Lowered threshold from 70 to 50

  return {
    isTampered,
    confidence,
    metadata: {
      width: img.width,
      height: img.height,
      format: imageUrl.split('.').pop()?.toLowerCase() || 'unknown',
      size: 0,
    },
    analysis: {
      compressionScore,
      pixelConsistency,
      textAlignment,
      metadataScore,
    },
  };
}

function analyzeCompression(pixels: Uint8ClampedArray, width: number, height: number): number {
  let compressionScore = 100;
  const blockSize = 8;
  
  // Check for JPEG compression artifacts
  for (let y = 0; y < height - blockSize; y += blockSize) {
    for (let x = 0; x < width - blockSize; x += blockSize) {
      let blockVariance = 0;
      let blockMean = 0;
      
      // Calculate block mean
      for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
          const idx = ((y + by) * width + (x + bx)) * 4;
          blockMean += (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
        }
      }
      blockMean /= blockSize * blockSize;
      
      // Calculate block variance
      for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
          const idx = ((y + by) * width + (x + bx)) * 4;
          const pixelValue = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
          blockVariance += Math.pow(pixelValue - blockMean, 2);
        }
      }
      blockVariance /= blockSize * blockSize;
      
      // Increased threshold for compression artifacts
      if (blockVariance > 2000) { // Increased from 1000 to 2000
        compressionScore -= 2; // Reduced penalty from 5 to 2
      }
    }
  }
  
  return Math.max(0, compressionScore);
}

function analyzePixelConsistency(pixels: Uint8ClampedArray, width: number, height: number): number {
  let consistencyScore = 100;
  const threshold = 50; // Increased from 30 to 50
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const currentPixel = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
      
      // Check surrounding pixels
      const surroundingPixels = [
        ((y - 1) * width + x) * 4,
        ((y + 1) * width + x) * 4,
        (y * width + (x - 1)) * 4,
        (y * width + (x + 1)) * 4,
      ];
      
      let abruptChanges = 0;
      for (const pixelIdx of surroundingPixels) {
        const surroundingPixel = (pixels[pixelIdx] + pixels[pixelIdx + 1] + pixels[pixelIdx + 2]) / 3;
        if (Math.abs(currentPixel - surroundingPixel) > threshold) {
          abruptChanges++;
        }
      }
      
      if (abruptChanges >= 3) {
        consistencyScore -= 0.05; // Reduced penalty from 0.1 to 0.05
      }
    }
  }
  
  return Math.max(0, consistencyScore);
}

function analyzeTextAlignment(pixels: Uint8ClampedArray, width: number, height: number): number {
  let alignmentScore = 100;
  const lineThreshold = 100; // Increased from 50 to 100
  
  // Check for horizontal lines
  for (let y = 0; y < height; y++) {
    let lineLength = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const pixelValue = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
      
      if (pixelValue < 128) { // Dark pixel
        lineLength++;
      } else {
        if (lineLength > lineThreshold) {
          alignmentScore -= 0.2; // Reduced penalty from 0.5 to 0.2
        }
        lineLength = 0;
      }
    }
  }
  
  return Math.max(0, alignmentScore);
}

function calculateMetadataScore(metadata: ImageMetadata): number {
  let score = 100;
  
  // Common WhatsApp screenshot dimensions
  const commonDimensions = [
    { width: 1080, height: 1920 }, // Portrait
    { width: 1920, height: 1080 }, // Landscape
    { width: 1170, height: 2532 }, // iPhone 13/14
    { width: 1284, height: 2778 }, // iPhone 13/14 Pro Max
    { width: 1440, height: 2560 }, // Common Android
    { width: 2560, height: 1440 }, // Common Android Landscape
  ];
  
  // Check if dimensions are close to common WhatsApp screenshot sizes
  const isCloseToCommonDimension = commonDimensions.some(dim => {
    const widthDiff = Math.abs(dim.width - metadata.width);
    const heightDiff = Math.abs(dim.height - metadata.height);
    return widthDiff <= 100 && heightDiff <= 100; // Allow 100px tolerance
  });
  
  if (!isCloseToCommonDimension) {
    score -= 10; // Reduced penalty from 20 to 10
  }
  
  // Check format
  if (metadata.format !== 'png' && metadata.format !== 'jpg' && metadata.format !== 'jpeg') {
    score -= 20; // Reduced penalty from 30 to 20
  }
  
  return score;
} 