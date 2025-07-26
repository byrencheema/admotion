/**
 * Advanced Color Extraction and Analysis System
 * Extracts dominant colors from images and provides intelligent color insights
 */

export interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  frequency: number;
  luminance: number;
  temperature: 'warm' | 'cool' | 'neutral';
  saturation: 'vibrant' | 'muted' | 'grayscale';
}

export interface ColorAnalysis {
  dominantColors: ExtractedColor[];
  primaryColor: ExtractedColor;
  accentColor: ExtractedColor;
  backgroundColor: ExtractedColor;
  colorHarmony: 'monochromatic' | 'complementary' | 'analogous' | 'triadic' | 'mixed';
  overallMood: 'energetic' | 'calm' | 'professional' | 'luxury' | 'organic' | 'tech';
  brandSuitability: 'corporate' | 'creative' | 'tech' | 'lifestyle' | 'healthcare' | 'finance';
  contrastLevel: 'high' | 'medium' | 'low';
  colorStory: string;
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;
  
  const l = sum / 2;
  
  if (diff === 0) {
    return [0, 0, l]; // achromatic
  }
  
  const s = l > 0.5 ? diff / (2 - sum) : diff / sum;
  
  let h = 0;
  switch (max) {
    case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / diff + 2) / 6; break;
    case b: h = ((r - g) / diff + 4) / 6; break;
  }
  
  return [h * 360, s, l];
}

/**
 * Calculate relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determine color temperature
 */
function getColorTemperature(h: number, s: number): 'warm' | 'cool' | 'neutral' {
  if (s < 0.15) return 'neutral'; // Low saturation = neutral
  
  if ((h >= 0 && h <= 60) || (h >= 300 && h <= 360)) {
    return 'warm'; // Red, orange, yellow, pink
  } else if (h >= 180 && h <= 300) {
    return 'cool'; // Blue, cyan, purple
  } else if (h >= 60 && h <= 180) {
    return h <= 120 ? 'warm' : 'cool'; // Green range varies
  }
  
  return 'neutral';
}

/**
 * Determine saturation level
 */
function getSaturationLevel(s: number, l: number): 'vibrant' | 'muted' | 'grayscale' {
  if (s < 0.1) return 'grayscale';
  if (s > 0.6 && l > 0.3 && l < 0.8) return 'vibrant';
  return 'muted';
}

/**
 * Advanced color clustering using k-means algorithm
 */
function clusterColors(colors: [number, number, number][], k: number = 5): ExtractedColor[] {
  if (colors.length === 0) return [];
  
  // Initialize centroids randomly
  let centroids = [];
  for (let i = 0; i < k; i++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    centroids.push([...randomColor]);
  }
  
  // K-means clustering
  for (let iteration = 0; iteration < 10; iteration++) {
    const clusters: [number, number, number][][] = Array(k).fill(null).map(() => []);
    
    // Assign colors to nearest centroid
    colors.forEach(color => {
      let minDistance = Infinity;
      let closestCentroid = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = Math.sqrt(
          Math.pow(color[0] - centroid[0], 2) +
          Math.pow(color[1] - centroid[1], 2) +
          Math.pow(color[2] - centroid[2], 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = index;
        }
      });
      
      clusters[closestCentroid].push(color);
    });
    
    // Update centroids
    centroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0]; // Keep old centroid if cluster is empty
      
      const avgR = cluster.reduce((sum, c) => sum + c[0], 0) / cluster.length;
      const avgG = cluster.reduce((sum, c) => sum + c[1], 0) / cluster.length;
      const avgB = cluster.reduce((sum, c) => sum + c[2], 0) / cluster.length;
      
      return [Math.round(avgR), Math.round(avgG), Math.round(avgB)];
    });
  }
  
  // Convert to ExtractedColor objects
  return centroids
    .map((centroid, index) => {
      const [r, g, b] = centroid;
      const [h, s, l] = rgbToHsl(r, g, b);
      const frequency = colors.filter(color => {
        const distance = Math.sqrt(
          Math.pow(color[0] - r, 2) +
          Math.pow(color[1] - g, 2) +
          Math.pow(color[2] - b, 2)
        );
        return distance < 50; // Colors within distance of 50
      }).length / colors.length;
      
      return {
        hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
        rgb: [r, g, b] as [number, number, number],
        hsl: [h, s, l] as [number, number, number],
        frequency,
        luminance: getLuminance(r, g, b),
        temperature: getColorTemperature(h, s),
        saturation: getSaturationLevel(s, l)
      };
    })
    .filter(color => color.frequency > 0.01) // Filter out very rare colors
    .sort((a, b) => b.frequency - a.frequency); // Sort by frequency
}

/**
 * Analyze color harmony
 */
function analyzeColorHarmony(colors: ExtractedColor[]): 'monochromatic' | 'complementary' | 'analogous' | 'triadic' | 'mixed' {
  if (colors.length < 2) return 'monochromatic';
  
  const hues = colors.map(c => c.hsl[0]);
  const uniqueHues = [...new Set(hues.map(h => Math.round(h / 30) * 30))]; // Round to nearest 30°
  
  if (uniqueHues.length <= 2) {
    const diff = Math.abs(uniqueHues[0] - (uniqueHues[1] || uniqueHues[0]));
    if (diff > 150 && diff < 210) return 'complementary';
    if (diff < 60) return 'analogous';
  }
  
  if (uniqueHues.length === 3) {
    // Check if hues are roughly 120° apart (triadic)
    const sorted = uniqueHues.sort((a, b) => a - b);
    const gaps = [
      sorted[1] - sorted[0],
      sorted[2] - sorted[1],
      360 - sorted[2] + sorted[0]
    ];
    
    if (gaps.every(gap => Math.abs(gap - 120) < 30)) {
      return 'triadic';
    }
  }
  
  return colors.every(c => c.saturation === 'grayscale') ? 'monochromatic' : 'mixed';
}

/**
 * Determine overall mood from colors
 */
function determineOverallMood(colors: ExtractedColor[]): ColorAnalysis['overallMood'] {
  if (colors.length === 0) return 'professional';
  
  const avgSaturation = colors.reduce((sum, c) => sum + c.hsl[1], 0) / colors.length;
  const avgLuminance = colors.reduce((sum, c) => sum + c.luminance, 0) / colors.length;
  const warmColors = colors.filter(c => c.temperature === 'warm').length;
  const coolColors = colors.filter(c => c.temperature === 'cool').length;
  const vibrantColors = colors.filter(c => c.saturation === 'vibrant').length;
  
  // High saturation + warm colors = energetic
  if (avgSaturation > 0.6 && warmColors > coolColors && vibrantColors > colors.length / 2) {
    return 'energetic';
  }
  
  // Cool colors + medium saturation = professional  
  if (coolColors > warmColors && avgSaturation > 0.3 && avgSaturation < 0.7) {
    return 'professional';
  }
  
  // Low saturation + high luminance = calm
  if (avgSaturation < 0.4 && avgLuminance > 0.6) {
    return 'calm';
  }
  
  // Purple/deep colors + high saturation = luxury
  const luxuryColors = colors.filter(c => {
    const [h] = c.hsl;
    return (h >= 240 && h <= 300) || (h >= 0 && h <= 30 && c.luminance < 0.3);
  });
  if (luxuryColors.length > colors.length / 3 && avgSaturation > 0.4) {
    return 'luxury';
  }
  
  // Green/brown colors = organic
  const organicColors = colors.filter(c => {
    const [h] = c.hsl;
    return (h >= 60 && h <= 180) || (h >= 20 && h <= 40);
  });
  if (organicColors.length > colors.length / 2) {
    return 'organic';
  }
  
  // Bright greens/blues + high saturation = tech
  if (coolColors > warmColors && avgSaturation > 0.5 && avgLuminance > 0.4) {
    return 'tech';
  }
  
  return 'professional';
}

/**
 * Determine brand suitability
 */
function determineBrandSuitability(mood: ColorAnalysis['overallMood'], colors: ExtractedColor[]): ColorAnalysis['brandSuitability'] {
  const blueColors = colors.filter(c => c.hsl[0] >= 200 && c.hsl[0] <= 260).length;
  const redColors = colors.filter(c => c.hsl[0] >= 340 || c.hsl[0] <= 20).length;
  const greenColors = colors.filter(c => c.hsl[0] >= 80 && c.hsl[0] <= 160).length;
  
  switch (mood) {
    case 'professional':
      return blueColors > 0 ? 'corporate' : 'finance';
    case 'energetic':
      return redColors > 0 ? 'lifestyle' : 'creative';
    case 'tech':
      return 'tech';
    case 'calm':
      return greenColors > 0 ? 'healthcare' : 'lifestyle';
    case 'luxury':
      return 'creative';
    case 'organic':
      return 'healthcare';
    default:
      return 'corporate';
  }
}

/**
 * Generate color story
 */
function generateColorStory(analysis: Partial<ColorAnalysis>): string {
  const { dominantColors, overallMood, colorHarmony, contrastLevel } = analysis;
  
  if (!dominantColors || dominantColors.length === 0) {
    return "No dominant colors detected in this image.";
  }
  
  const primary = dominantColors[0];
  const temperatureDesc = primary.temperature === 'warm' ? 'warm and inviting' : 
                         primary.temperature === 'cool' ? 'cool and modern' : 'balanced and neutral';
  
  const harmonyDesc = {
    monochromatic: 'unified and consistent',
    complementary: 'bold and high-contrast',
    analogous: 'harmonious and flowing',
    triadic: 'vibrant and dynamic',
    mixed: 'diverse and eclectic'
  }[colorHarmony || 'mixed'];
  
  return `This image features ${temperatureDesc} tones with a ${harmonyDesc} color palette. The ${overallMood} mood is established through ${primary.saturation} colors with ${contrastLevel} contrast levels, making it ideal for ${analysis.brandSuitability} branding.`;
}

/**
 * Main color extraction function
 */
export async function extractColorsFromImage(imageFile: File): Promise<ColorAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      try {
        // Scale down large images for faster processing
        const maxSize = 300;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Sample pixels (every 4th pixel for performance)
        const sampledColors: [number, number, number][] = [];
        for (let i = 0; i < pixels.length; i += 16) { // Skip 4 pixels
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const alpha = pixels[i + 3];
          
          // Skip transparent pixels
          if (alpha > 128) {
            sampledColors.push([r, g, b]);
          }
        }
        
        // Extract dominant colors using k-means clustering
        const dominantColors = clusterColors(sampledColors, 6);
        
        if (dominantColors.length === 0) {
          resolve({
            dominantColors: [],
            primaryColor: { hex: '#808080', rgb: [128, 128, 128], hsl: [0, 0, 0.5], frequency: 1, luminance: 0.5, temperature: 'neutral', saturation: 'grayscale' },
            accentColor: { hex: '#808080', rgb: [128, 128, 128], hsl: [0, 0, 0.5], frequency: 1, luminance: 0.5, temperature: 'neutral', saturation: 'grayscale' },
            backgroundColor: { hex: '#f8f9fa', rgb: [248, 249, 250], hsl: [210, 0.167, 0.976], frequency: 0, luminance: 0.9, temperature: 'neutral', saturation: 'grayscale' },
            colorHarmony: 'monochromatic',
            overallMood: 'professional',
            brandSuitability: 'corporate',
            contrastLevel: 'medium',
            colorStory: 'This image appears to be monochromatic or contains very subtle colors.'
          });
          return;
        }
        
        // Identify specific color roles
        const primaryColor = dominantColors[0];
        const accentColor = dominantColors.find(c => c.hex !== primaryColor.hex) || primaryColor;
        const backgroundColor = dominantColors.find(c => c.luminance > 0.8) || 
                              { hex: '#f8f9fa', rgb: [248, 249, 250] as [number, number, number], hsl: [210, 0.167, 0.976] as [number, number, number], frequency: 0, luminance: 0.9, temperature: 'neutral' as const, saturation: 'grayscale' as const };
        
        // Analyze color relationships
        const colorHarmony = analyzeColorHarmony(dominantColors);
        const overallMood = determineOverallMood(dominantColors);
        const brandSuitability = determineBrandSuitability(overallMood, dominantColors);
        
        // Calculate contrast level
        const luminanceRange = Math.max(...dominantColors.map(c => c.luminance)) - Math.min(...dominantColors.map(c => c.luminance));
        const contrastLevel: 'high' | 'medium' | 'low' = luminanceRange > 0.6 ? 'high' : luminanceRange > 0.3 ? 'medium' : 'low';
        
        const analysis: ColorAnalysis = {
          dominantColors,
          primaryColor,
          accentColor,
          backgroundColor,
          colorHarmony,
          overallMood,
          brandSuitability,
          contrastLevel,
          colorStory: ''
        };
        
        analysis.colorStory = generateColorStory(analysis);
        
        resolve(analysis);
        
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Quick color extraction for immediate feedback
 */
export function quickColorExtraction(imageFile: File): Promise<string[]> {
  return extractColorsFromImage(imageFile)
    .then(analysis => analysis.dominantColors.slice(0, 3).map(c => c.hex))
    .catch(() => ['#808080', '#606060', '#404040']); // Fallback colors
}