# Smart Color Extraction and Integration System

## Overview

This document describes the comprehensive color extraction and integration system implemented to replace hardcoded colors with real colors extracted from user-uploaded images. The system uses advanced client-side color analysis and integrates extracted colors throughout the video generation pipeline.

## Problem Statement

**Previous System Issues:**
- Templates used hardcoded color arrays (`['#FF6B6B', '#4ECDC4', '#FFE66D']`)
- Image analysis was fake - based only on filename keywords
- Videos generated with generic colors regardless of uploaded brand images
- No visual consistency between uploaded brand assets and generated content

**Solution Implemented:**
- Real-time color extraction using k-means clustering and HSL analysis
- Dynamic color integration throughout the template system
- Intelligent color matching and palette generation
- Persistent storage of color analysis data

## Architecture Overview

```
User Upload → Color Analysis → Storage → Template System → Video Generation
     ↓              ↓            ↓           ↓              ↓
  ImageUpload  → ColorExtraction → API → Agents → SceneTemplates
```

## Core Components

### 1. Color Extraction Engine (`src/lib/color-extraction.ts`)

**Key Classes and Interfaces:**

```typescript
interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  frequency: number;
  luminance: number;
  temperature: 'warm' | 'cool' | 'neutral';
  saturation: 'vibrant' | 'muted' | 'grayscale';
}

interface ColorAnalysis {
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
```

**Key Algorithms:**

1. **K-means Color Clustering:**
   ```typescript
   function clusterColors(colors: [number, number, number][], k: number = 5): ExtractedColor[]
   ```
   - Samples pixels from uploaded images (every 4th pixel for performance)
   - Uses k-means algorithm to find 5-6 dominant color clusters
   - Calculates color frequency, luminance, and categorization

2. **Intelligent Mood Detection:**
   ```typescript
   function determineOverallMood(colors: ExtractedColor[]): ColorAnalysis['overallMood']
   ```
   - Analyzes saturation, luminance, and temperature
   - Maps color characteristics to brand moods
   - Considers color psychology principles

3. **Brand Suitability Analysis:**
   ```typescript
   function determineBrandSuitability(mood: ColorAnalysis['overallMood'], colors: ExtractedColor[]): ColorAnalysis['brandSuitability']
   ```
   - Maps color moods to industry verticals
   - Considers dominant hue ranges (blue → corporate, red → lifestyle)

### 2. Enhanced Image Upload (`src/components/ImageUpload.tsx`)

**Key Changes Made:**

1. **Added Color Analysis Integration:**
   ```typescript
   interface ImageUploadProps {
     onImageSelect: (image: File, previewUrl?: string, imageId?: string, colorAnalysis?: ColorAnalysis) => void;
     // ... other props
   }
   ```

2. **Real-time Color Processing:**
   ```typescript
   // Start color analysis
   setAnalyzing(true);
   let colorAnalysis: ColorAnalysis | undefined;
   
   try {
     console.log('🎨 Analyzing image colors:', file.name);
     colorAnalysis = await extractColorsFromImage(file);
     setColorPreview(colorAnalysis.dominantColors.slice(0, 5).map(c => c.hex));
   } catch (err) {
     console.warn('⚠️ Color analysis failed:', err);
   } finally {
     setAnalyzing(false);
   }
   ```

3. **Visual Color Preview:**
   - Shows extracted colors as circular swatches
   - Updates UI states: analyzing → uploading → complete
   - Handles errors gracefully with fallbacks

### 3. Enhanced Image Manager (`src/lib/templates/image-manager.ts`)

**Key Changes Made:**

1. **Added ColorAnalysis Storage:**
   ```typescript
   export interface ImageAsset {
     id: string;
     fileName: string;
     url: string;
     type: string;
     size: number;
     analysis?: ImageAnalysis; // Old filename-based analysis
     colorAnalysis?: ColorAnalysis; // New real color analysis
   }
   ```

2. **Persistent Color Data Storage:**
   ```typescript
   async saveColorAnalysis(fileName: string, colorAnalysis: ColorAnalysis): Promise<void>
   async loadColorAnalysis(fileName: string): Promise<ColorAnalysis | undefined>
   ```
   - Stores color analysis as JSON files in `/public/uploads/color-data/`
   - Loads saved analysis when images are accessed by templates

3. **Enhanced Image Context Generation:**
   ```typescript
   // Use real color analysis if available, fallback to filename-based analysis
   const colors = colorAnalysis 
     ? colorAnalysis.dominantColors.slice(0, 3).map(c => c.hex).join(', ')
     : analysis?.dominantColors.join(', ') || 'unknown';
   ```

### 4. Template Director Integration (`src/lib/templates/template-director.ts`)

**Key Changes Made:**

1. **Real Color Context for AI:**
   ```typescript
   context += `- ${img.url}: ${analysis?.contentType} (${mood} mood, REAL COLORS: ${colors}`;
   
   if (colorAnalysis) {
     context += `, harmony: ${colorAnalysis.colorHarmony}, brand: ${colorAnalysis.brandSuitability}`;
   }
   ```

2. **Enhanced AI Prompts:**
   - AI agents now receive actual extracted colors instead of fake ones
   - Include color harmony and brand suitability information
   - Provide rich context for intelligent color application

### 5. Template Orchestrator Updates (`src/lib/templates/template-orchestrator.ts`)

**Key Changes Made:**

1. **Color Palette Extraction and Distribution:**
   ```typescript
   // Extract color palettes from all images
   const colorPalettes = availableImages
     .filter(img => img.colorAnalysis)
     .map(img => ({
       fileName: img.fileName,
       colors: img.colorAnalysis!.dominantColors.slice(0, 3).map(c => c.hex),
       primaryColor: img.colorAnalysis!.primaryColor.hex,
       accentColor: img.colorAnalysis!.accentColor.hex,
       mood: img.colorAnalysis!.overallMood,
       harmony: img.colorAnalysis!.colorHarmony
     }));
   ```

2. **Scene Prop Enhancement:**
   ```typescript
   videoStructure.scenes.forEach(scene => {
     if (!scene.props.images) {
       scene.props.images = imageUrls;
     }
     if (!scene.props.colorPalettes) {
       scene.props.colorPalettes = colorPalettes;
     }
   });
   ```

3. **Master Composition Generation:**
   ```typescript
   const colorProps = scene.props.colorPalettes ? `colorPalettes={${JSON.stringify(scene.props.colorPalettes)}}` : '';
   
   return `
     <TransitionSeries.Sequence durationInFrames={${scene.durationInFrames}}>
       <${SceneName} ${imageProps} ${colorProps} />
     </TransitionSeries.Sequence>
   `;
   ```

### 6. Template Generator Enhancements (`src/lib/templates/template-generator.ts`)

**Key Changes Made:**

1. **Smart Color Extraction from Palettes:**
   ```typescript
   private getColorsFromPalettes(colorPalettes: any[]): string[] {
     if (colorPalettes.length === 0) {
       return ['#2563eb', '#7c3aed', '#dc2626', '#059669', '#ea580c', '#8b5cf6'];
     }
     
     const allColors: string[] = [];
     colorPalettes.forEach(palette => {
       if (palette.colors && Array.isArray(palette.colors)) {
         allColors.push(...palette.colors);
       }
       if (palette.primaryColor) allColors.push(palette.primaryColor);
       if (palette.accentColor) allColors.push(palette.accentColor);
     });
     
     const uniqueColors = [...new Set(allColors)];
     // Generate variations if needed to ensure 6+ colors
     return uniqueColors.slice(0, 6);
   }
   ```

2. **Dynamic Color Application:**
   ```typescript
   // Replace hardcoded colors with extracted colors
   features = (props.features as string[]).map((title, index) => ({
     title,
     description: `Amazing ${title.toLowerCase()} capability`,
     emoji: ['🚀', '⭐', '⚡', '🎯', '💎', '🔥'][index % 6],
     icon: index % 2 === 0 ? 'circle' : 'rect',
     color: extractedColors[index % extractedColors.length] // ← Real colors!
   }));
   ```

3. **Color Variation Generation:**
   ```typescript
   private generateColorVariation(baseColor: string): string {
     // Darken or lighten by 20% for color variations
     const factor = Math.random() > 0.5 ? 0.8 : 1.2;
     // ... HSL manipulation logic
   }
   ```

### 7. Scene Template Updates (`src/lib/templates/scene-templates.ts`)

**Key Changes Made:**

1. **Enhanced Component Props:**
   ```typescript
   const {SCENE_NAME}: React.FC<{ 
     title: string; 
     subtitle?: string; 
     images?: string[]; 
     colorPalettes?: any[] // ← New prop
   }> = ({ title, subtitle, images = [], colorPalettes = [] }) => {
   ```

2. **Dynamic Color Extraction in Templates:**
   ```typescript
   // Extract colors from palettes for dynamic styling
   const primaryColor = colorPalettes.length > 0 && colorPalettes[0].primaryColor 
     ? colorPalettes[0].primaryColor 
     : '#2563eb';
   const accentColor = colorPalettes.length > 0 && colorPalettes[0].accentColor 
     ? colorPalettes[0].accentColor 
     : '#7c3aed';
   
   // Convert hex to rgba for gradients
   const hexToRgba = (hex: string, alpha: number) => {
     const r = parseInt(hex.slice(1, 3), 16);
     const g = parseInt(hex.slice(3, 5), 16);
     const b = parseInt(hex.slice(5, 7), 16);
     return `rgba(${r}, ${g}, ${b}, ${alpha})`;
   };
   ```

3. **Dynamic Gradient Application:**
   ```typescript
   // OLD: Hardcoded colors
   background: `linear-gradient(135deg, rgba(0,0,0,${overlayOpacity}) 0%, rgba(30,30,60,${overlayOpacity * 0.8}) 100%)`,
   
   // NEW: Dynamic colors from extracted palette
   background: `linear-gradient(135deg, ${hexToRgba(primaryColor, overlayOpacity * 0.6)} 0%, ${hexToRgba(accentColor, overlayOpacity * 0.4)} 100%)`,
   ```

### 8. API Integration Updates

**Image Upload API (`src/app/api/ingest-image/route.ts`):**

1. **Color Analysis Storage:**
   ```typescript
   const colorAnalysisStr = formData.get('colorAnalysis') as string;
   
   if (colorAnalysisStr) {
     try {
       const colorAnalysis: ColorAnalysis = JSON.parse(colorAnalysisStr);
       await imageManager.saveColorAnalysis(fileName, colorAnalysis);
       console.log('🎨 Color analysis saved for:', fileName);
     } catch (colorError) {
       console.warn('⚠️ Failed to save color analysis:', colorError);
     }
   }
   ```

**Reset API (`src/app/api/reset/route.ts`):**

1. **Color Data Cleanup:**
   ```typescript
   async function clearColorAnalysisData() {
     try {
       const COLOR_DATA_DIR = join(process.cwd(), 'public', 'uploads', 'color-data');
       const files = await readdirSync(COLOR_DATA_DIR);
       
       for (const file of files) {
         const filePath = join(COLOR_DATA_DIR, file);
         await unlinkSync(filePath);
         console.log(`🗑️ Deleted color analysis: ${file}`);
       }
     } catch (error) {
       console.warn('⚠️ Could not clear color analysis data:', error);
     }
   }
   ```

### 9. Frontend State Management Updates (`src/app/page.tsx`)

**Key Changes Made:**

1. **Color Analysis State Management:**
   ```typescript
   const [imageColorAnalysis, setImageColorAnalysis] = useState<Map<string, ColorAnalysis>>(new Map());
   
   const handleImageSelect = (image: File, previewUrl?: string, imageId?: string, colorAnalysis?: ColorAnalysis) => {
     setUploadedImages(prev => [...prev, image]);
     
     // Store color analysis for this image
     if (colorAnalysis) {
       setImageColorAnalysis(prev => {
         const newMap = new Map(prev);
         newMap.set(image.name, colorAnalysis);
         return newMap;
       });
     }
   };
   ```

2. **State Cleanup Integration:**
   ```typescript
   // Clear color analysis when images are cleared
   setImageColorAnalysis(new Map());
   ```

## Data Flow

### 1. Image Upload Flow
```
User selects image → ImageUpload component
  ↓
Client-side color extraction (k-means clustering)
  ↓
Color analysis object created (ExtractedColor[])
  ↓
Image + ColorAnalysis uploaded to server
  ↓
Server saves image + stores color analysis as JSON
  ↓
Frontend stores color analysis in state
```

### 2. Video Generation Flow
```
User triggers video generation
  ↓
Template Orchestrator loads images + color analysis
  ↓
Color palettes extracted and distributed to scenes
  ↓
Template Director receives real color context
  ↓
Template Generator uses extracted colors instead of hardcoded ones
  ↓
Scene Templates receive colorPalettes prop
  ↓
Dynamic color application in gradients, cards, elements
  ↓
Video rendered with user's actual brand colors
```

## File Structure Changes

### New Files Created:
- `src/lib/color-extraction.ts` - Core color analysis engine
- `public/uploads/color-data/` - Directory for stored color analysis JSON files

### Modified Files:
- `src/components/ImageUpload.tsx` - Added color extraction integration
- `src/lib/templates/image-manager.ts` - Enhanced with color analysis storage
- `src/lib/templates/template-director.ts` - Real color context for AI
- `src/lib/templates/template-orchestrator.ts` - Color palette distribution
- `src/lib/templates/template-generator.ts` - Dynamic color application
- `src/lib/templates/scene-templates.ts` - Template color prop support
- `src/app/api/ingest-image/route.ts` - Color analysis storage
- `src/app/api/reset/route.ts` - Color data cleanup
- `src/app/page.tsx` - Color analysis state management

## Usage Examples

### Before (Hardcoded Colors):
```typescript
// Template always used generic colors
const features = [
  { title: 'Feature 1', color: '#FF6B6B' },
  { title: 'Feature 2', color: '#4ECDC4' },
  { title: 'Feature 3', color: '#FFE66D' }
];

// Background always dark blue
background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(30,30,60,0.5) 100%)'
```

### After (Dynamic Colors):
```typescript
// Template uses real extracted colors
const extractedColors = colorPalettes[0]?.colors || ['#2563eb', '#7c3aed', '#dc2626'];
const features = [
  { title: 'Feature 1', color: extractedColors[0] }, // Could be '#dc143c' from Nike logo
  { title: 'Feature 2', color: extractedColors[1] }, // Could be '#ffffff' from Nike logo
  { title: 'Feature 3', color: extractedColors[2] }  // Could be '#000000' from Nike logo
];

// Background matches brand colors
const primaryColor = colorPalettes[0]?.primaryColor || '#2563eb';
const accentColor = colorPalettes[0]?.accentColor || '#7c3aed';
background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.6)} 0%, ${hexToRgba(accentColor, 0.4)} 100%)`
```

## Performance Considerations

1. **Client-side Processing:** Color extraction runs on the client to avoid server load
2. **Image Scaling:** Large images are scaled down to 300px max dimension for faster processing
3. **Pixel Sampling:** Every 4th pixel is sampled (instead of every pixel) for performance
4. **Caching:** Color analysis is stored and reused, not recalculated on each video generation
5. **Fallbacks:** System gracefully handles analysis failures with default color palettes

## Error Handling

1. **Color Extraction Failures:** Continue with filename-based analysis
2. **Storage Failures:** Log warnings but don't block video generation
3. **Missing Color Data:** Use intelligent defaults based on image analysis
4. **Invalid Color Values:** Validate hex codes and provide fallbacks

## Future Enhancements

1. **Advanced Color Theory:** Implement triadic and complementary color scheme generation
2. **Color Accessibility:** Ensure WCAG contrast ratios are maintained
3. **Brand Color Learning:** Machine learning to improve color selection over time
4. **Real-time Preview:** Show color changes in video preview before generation
5. **Color Palette Export:** Allow users to export extracted color palettes

## Testing Considerations

1. **Upload various image types:** JPG, PNG, SVG, WebP
2. **Test with different color schemes:** Monochromatic, vibrant, muted, high-contrast
3. **Verify color persistence:** Colors should survive page refreshes and resets
4. **Check fallback behavior:** System should work when color extraction fails
5. **Performance testing:** Large images and multiple uploads

---

This system transforms the Admotion platform from using generic template colors to creating videos that truly match users' brand identities through sophisticated color analysis and integration.