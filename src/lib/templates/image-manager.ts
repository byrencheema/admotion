import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export interface ImageAsset {
  id: string;
  fileName: string;
  url: string;
  type: string;
  size: number;
  analysis?: ImageAnalysis;
}

export interface ImageAnalysis {
  dominantColors: string[];
  mood: 'professional' | 'energetic' | 'calm' | 'luxury' | 'tech' | 'organic';
  contentType: 'logo' | 'product' | 'person' | 'landscape' | 'abstract' | 'icon';
  suggestedUsage: 'background' | 'overlay' | 'feature' | 'logo' | 'decoration';
}

export class ImageManager {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');

  async getAvailableImages(): Promise<ImageAsset[]> {
    if (!existsSync(this.uploadDir)) {
      console.log('📁 No upload directory found');
      return [];
    }

    try {
      const files = await readdir(this.uploadDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      );

      console.log(`🖼️ Found ${imageFiles.length} images to analyze`);

      const images: ImageAsset[] = imageFiles.map(fileName => ({
        id: path.parse(fileName).name, // Use filename without extension as ID
        fileName,
        url: `/uploads/images/${fileName}`,
        type: path.extname(fileName).toLowerCase(),
        size: 0, // Would need fs.stat to get actual size
        analysis: this.analyzeImageFromFilename(fileName)
      }));

      return images;
    } catch (error) {
      console.error('💥 Error reading images directory:', error);
      return [];
    }
  }

  private analyzeImageFromFilename(fileName: string): ImageAnalysis {
    const nameLower = fileName.toLowerCase();
    
    // Analyze content type from filename
    let contentType: ImageAnalysis['contentType'] = 'abstract';
    if (nameLower.includes('logo')) contentType = 'logo';
    else if (nameLower.includes('product')) contentType = 'product';
    else if (nameLower.includes('person') || nameLower.includes('team')) contentType = 'person';
    else if (nameLower.includes('background') || nameLower.includes('landscape')) contentType = 'landscape';
    else if (nameLower.includes('icon')) contentType = 'icon';

    // Analyze mood from filename and extension
    let mood: ImageAnalysis['mood'] = 'professional';
    if (nameLower.includes('energy') || nameLower.includes('dynamic')) mood = 'energetic';
    else if (nameLower.includes('calm') || nameLower.includes('minimal')) mood = 'calm';
    else if (nameLower.includes('luxury') || nameLower.includes('premium')) mood = 'luxury';
    else if (nameLower.includes('tech') || nameLower.includes('digital')) mood = 'tech';
    else if (nameLower.includes('organic') || nameLower.includes('nature')) mood = 'organic';

    // Suggest usage based on content type
    let suggestedUsage: ImageAnalysis['suggestedUsage'] = 'decoration';
    switch (contentType) {
      case 'logo': suggestedUsage = 'logo'; break;
      case 'product': suggestedUsage = 'feature'; break;
      case 'landscape': suggestedUsage = 'background'; break;
      case 'icon': suggestedUsage = 'decoration'; break;
      default: suggestedUsage = 'overlay';
    }

    // Generate dominant colors based on mood
    const colorMap = {
      professional: ['#2563eb', '#1e40af', '#3b82f6'],
      energetic: ['#ef4444', '#f97316', '#eab308'],
      calm: ['#06b6d4', '#0891b2', '#0e7490'],
      luxury: ['#7c3aed', '#a855f7', '#c084fc'],
      tech: ['#10b981', '#059669', '#047857'],
      organic: ['#65a30d', '#84cc16', '#a3e635']
    };

    return {
      dominantColors: colorMap[mood],
      mood,
      contentType,
      suggestedUsage
    };
  }

  selectImagesForScene(
    images: ImageAsset[], 
    sceneCategory: string, 
    templateId: string
  ): ImageAsset[] {
    if (images.length === 0) return [];

    const preferences = this.getSceneImagePreferences(sceneCategory, templateId);
    
    // Sort images by relevance to scene
    const scored = images.map(image => ({
      image,
      score: this.calculateImageRelevanceScore(image, preferences)
    }));

    scored.sort((a, b) => b.score - a.score);
    
    // Return top 3 most relevant images
    return scored.slice(0, 3).map(item => item.image);
  }

  private getSceneImagePreferences(sceneCategory: string, templateId: string) {
    const preferences: Record<string, {
      contentTypes: ImageAnalysis['contentType'][];
      moods: ImageAnalysis['mood'][];
      usages: ImageAnalysis['suggestedUsage'][];
    }> = {
      hero: {
        contentTypes: ['logo', 'product', 'landscape'],
        moods: ['professional', 'energetic', 'luxury'],
        usages: ['background', 'logo', 'feature']
      },
      features: {
        contentTypes: ['product', 'icon', 'abstract'],
        moods: ['professional', 'tech', 'energetic'],
        usages: ['feature', 'decoration', 'overlay']
      },
      product: {
        contentTypes: ['product', 'logo'],
        moods: ['professional', 'luxury', 'tech'],
        usages: ['feature', 'logo']
      },
      cta: {
        contentTypes: ['logo', 'icon'],
        moods: ['energetic', 'professional'],
        usages: ['logo', 'decoration']
      },
      stats: {
        contentTypes: ['icon', 'abstract'],
        moods: ['professional', 'tech'],
        usages: ['decoration', 'overlay']
      }
    };

    return preferences[sceneCategory] || preferences.hero;
  }

  private calculateImageRelevanceScore(image: ImageAsset, preferences: any): number {
    let score = 0;
    const analysis = image.analysis;
    
    if (!analysis) return 0;

    // Content type match (40% weight)
    if (preferences.contentTypes.includes(analysis.contentType)) score += 40;
    
    // Mood match (30% weight)  
    if (preferences.moods.includes(analysis.mood)) score += 30;
    
    // Usage match (30% weight)
    if (preferences.usages.includes(analysis.suggestedUsage)) score += 30;

    return score;
  }

  generateImagePrompts(images: ImageAsset[], sceneCategory: string): string {
    if (images.length === 0) {
      return "No uploaded images available. Use default styling.";
    }

    const imageDescriptions = images.map(img => {
      const analysis = img.analysis;
      return `Image "${img.fileName}": ${analysis?.contentType} with ${analysis?.mood} mood, suggested for ${analysis?.suggestedUsage} use, colors: ${analysis?.dominantColors.join(', ')}`;
    }).join('\n');

    return `AVAILABLE IMAGES FOR ${sceneCategory.toUpperCase()} SCENE:
${imageDescriptions}

INTEGRATION INSTRUCTIONS:
- Use staticFile() to reference images: staticFile('/uploads/images/filename.jpg')
- Consider image mood and colors when choosing scene styling
- Use images as backgrounds, overlays, or decorative elements as suggested
- Ensure images complement the scene's purpose and visual hierarchy
- Apply appropriate transforms, opacity, and blend modes for professional results`;
  }
}

export const imageManager = new ImageManager();