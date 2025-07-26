import { SCENE_TEMPLATES, getTemplatesByCategory, getTemplatesByStyle, getTemplatesByComplexity } from './scene-templates';

export interface ContentAnalysis {
  industry: string;
  tone: 'professional' | 'playful' | 'luxury' | 'tech' | 'organic' | 'minimal';
  visualStyle: 'minimal' | 'modern' | 'futuristic' | 'organic' | 'retro';
  complexity: 'simple' | 'medium' | 'complex';
  keywords: string[];
  suggestedFlow: string[];
}

export class SmartTemplateSelector {
  
  /**
   * Analyzes the prompt and suggests optimal template selections
   */
  analyzeContent(prompt: string): ContentAnalysis {
    const lowerPrompt = prompt.toLowerCase();
    
    // Industry detection
    let industry = 'general';
    if (lowerPrompt.includes('app') || lowerPrompt.includes('software') || lowerPrompt.includes('tech')) {
      industry = 'technology';
    } else if (lowerPrompt.includes('game') || lowerPrompt.includes('gaming')) {
      industry = 'gaming';
    } else if (lowerPrompt.includes('luxury') || lowerPrompt.includes('premium')) {
      industry = 'luxury';
    } else if (lowerPrompt.includes('food') || lowerPrompt.includes('restaurant')) {
      industry = 'food';
    } else if (lowerPrompt.includes('fitness') || lowerPrompt.includes('health')) {
      industry = 'health';
    }
    
    // Tone detection
    let tone: ContentAnalysis['tone'] = 'professional';
    if (lowerPrompt.includes('fun') || lowerPrompt.includes('playful') || lowerPrompt.includes('game')) {
      tone = 'playful';
    } else if (lowerPrompt.includes('luxury') || lowerPrompt.includes('premium') || lowerPrompt.includes('elegant')) {
      tone = 'luxury';
    } else if (lowerPrompt.includes('tech') || lowerPrompt.includes('ai') || lowerPrompt.includes('futuristic')) {
      tone = 'tech';
    } else if (lowerPrompt.includes('natural') || lowerPrompt.includes('organic') || lowerPrompt.includes('eco')) {
      tone = 'organic';
    } else if (lowerPrompt.includes('simple') || lowerPrompt.includes('clean') || lowerPrompt.includes('minimal')) {
      tone = 'minimal';
    }
    
    // Visual style mapping
    let visualStyle: ContentAnalysis['visualStyle'] = 'modern';
    switch (tone) {
      case 'tech':
        visualStyle = 'futuristic';
        break;
      case 'organic':
        visualStyle = 'organic';
        break;
      case 'minimal':
        visualStyle = 'minimal';
        break;
      case 'luxury':
        visualStyle = 'modern';
        break;
      default:
        visualStyle = 'modern';
    }
    
    // Complexity based on prompt sophistication
    let complexity: ContentAnalysis['complexity'] = 'medium';
    if (lowerPrompt.includes('advanced') || lowerPrompt.includes('professional') || lowerPrompt.includes('enterprise')) {
      complexity = 'complex';
    } else if (lowerPrompt.includes('simple') || lowerPrompt.includes('basic') || lowerPrompt.includes('easy')) {
      complexity = 'simple';
    }
    
    // Extract keywords
    const keywords = lowerPrompt
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
    
    // Suggest content flow
    const suggestedFlow = this.suggestContentFlow(industry, tone);
    
    return {
      industry,
      tone,
      visualStyle,
      complexity,
      keywords,
      suggestedFlow
    };
  }
  
  /**
   * Suggests optimal content flow based on industry and tone
   */
  private suggestContentFlow(industry: string, tone: string): string[] {
    const baseFlow = ['hero', 'features', 'cta'];
    
    if (industry === 'technology') {
      return ['hero', 'product', 'features', 'stats', 'cta'];
    } else if (industry === 'gaming') {
      return ['hero', 'features', 'product', 'cta'];
    } else if (industry === 'luxury') {
      return ['hero', 'product', 'features', 'cta', 'logo'];
    } else if (tone === 'professional') {
      return ['hero', 'features', 'stats', 'cta'];
    }
    
    return baseFlow;
  }
  
  /**
   * Selects the best templates based on content analysis
   */
  selectOptimalTemplates(analysis: ContentAnalysis, targetScenes: number = 5): string[] {
    const selectedTemplates: string[] = [];
    
    for (const category of analysis.suggestedFlow) {
      const categoryTemplates = getTemplatesByCategory(category);
      const styleFiltered = categoryTemplates.filter(t => t.visualStyle === analysis.visualStyle);
      const complexityFiltered = categoryTemplates.filter(t => t.complexity === analysis.complexity);
      
      // Prefer style match, then complexity, then any in category
      let candidates = styleFiltered.length > 0 ? styleFiltered : 
                     complexityFiltered.length > 0 ? complexityFiltered :
                     categoryTemplates;
      
      if (candidates.length === 0) {
        // Fallback to any template in category
        candidates = getTemplatesByCategory(category);
      }
      
      if (candidates.length > 0) {
        // Select the most advanced template that matches criteria
        const template = this.selectBestTemplate(candidates, analysis);
        if (template) {
          selectedTemplates.push(template.id);
        }
      }
    }
    
    // Fill remaining slots with diverse templates
    while (selectedTemplates.length < targetScenes) {
      const remaining = SCENE_TEMPLATES.filter(t => !selectedTemplates.includes(t.id));
      if (remaining.length === 0) break;
      
      const template = this.selectBestTemplate(remaining, analysis);
      if (template) {
        selectedTemplates.push(template.id);
      }
    }
    
    return selectedTemplates.slice(0, targetScenes);
  }
  
  /**
   * Selects the best template from candidates based on analysis
   */
  private selectBestTemplate(candidates: typeof SCENE_TEMPLATES, analysis: ContentAnalysis) {
    // Score templates based on match with analysis
    const scored = candidates.map(template => {
      let score = 0;
      
      // Visual style match
      if (template.visualStyle === analysis.visualStyle) score += 3;
      
      // Complexity preference
      if (template.complexity === analysis.complexity) score += 2;
      else if (template.complexity === 'complex') score += 1; // Prefer complex for impact
      
      // Keyword relevance
      const templateText = `${template.name} ${template.description}`.toLowerCase();
      analysis.keywords.forEach(keyword => {
        if (templateText.includes(keyword)) score += 1;
      });
      
      return { template, score };
    });
    
    // Sort by score and return best
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.template;
  }
  
  /**
   * Generates contextual props based on prompt and template
   */
  async generateContextualProps(prompt: string, templateId: string, analysis: ContentAnalysis): Promise<Record<string, unknown>> {
    const template = SCENE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return {};
    
    // Try to get contextual information from Senso for more accurate props
    const contextualInfo = await this.getContextualInfo(prompt);
    
    const props: Record<string, unknown> = {};
    
    // Extract potential brand/product name from prompt
    const words = prompt.split(/\s+/);
    const brandName = this.extractBrandName(prompt) || 'Your Brand';
    const productName = this.extractProductName(prompt) || 'Amazing Product';
    
    // Generate props based on template requirements
    template.requiredProps.forEach(prop => {
      switch (prop) {
        case 'title':
          props.title = this.generateTitle(prompt, analysis, contextualInfo);
          break;
        case 'subtitle':
          props.subtitle = this.generateSubtitle(prompt, analysis, contextualInfo);
          break;
        case 'mainText':
          props.mainText = this.generateMainText(prompt, analysis, contextualInfo);
          break;
        case 'buttonText':
          props.buttonText = this.generateButtonText(analysis);
          break;
        case 'brandName':
          props.brandName = brandName;
          break;
        case 'productName':
          props.productName = productName;
          break;
        case 'features':
          props.features = this.generateFeatures(prompt, analysis);
          break;
        case 'stats':
          props.stats = this.generateStats(analysis);
          break;
      }
    });
    
    return props;
  }
  
  private extractBrandName(prompt: string): string | null {
    // Look for capitalized words that might be brand names
    const words = prompt.split(/\s+/);
    const capitalized = words.filter(word => /^[A-Z][a-z]+$/.test(word));
    return capitalized[0] || null;
  }
  
  private extractProductName(prompt: string): string | null {
    const productWords = ['app', 'software', 'platform', 'service', 'product', 'tool', 'system'];
    const words = prompt.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      if (productWords.includes(words[i]) && i > 0) {
        return words[i - 1].charAt(0).toUpperCase() + words[i - 1].slice(1) + ' ' + 
               words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
    }
    return null;
  }
  
  private generateTitle(prompt: string, analysis: ContentAnalysis, contextualInfo?: string | null): string {
    const maxLength = 40;
    
    // If we have contextual info, try to extract a more relevant title
    if (contextualInfo) {
      const lines = contextualInfo.split('\n');
      const titleLine = lines.find(line => 
        line.toLowerCase().includes('title') || 
        line.toLowerCase().includes('name') ||
        line.toLowerCase().includes('product')
      );
      if (titleLine) {
        const extractedTitle = titleLine.replace(/^[^:]*:?\s*/, '').trim();
        if (extractedTitle && extractedTitle.length <= maxLength) {
          return extractedTitle;
        }
      }
    }
    
    let title = prompt.length > maxLength ? prompt.substring(0, maxLength) + '...' : prompt;
    
    // Make it more engaging based on tone
    switch (analysis.tone) {
      case 'tech':
        return `Next-Gen ${title}`;
      case 'luxury':
        return `Premium ${title}`;
      case 'playful':
        return `Amazing ${title}`;
      default:
        return title;
    }
  }
  
  private generateSubtitle(prompt: string, analysis: ContentAnalysis, contextualInfo?: string | null): string {
    // If we have contextual info, try to extract a tagline or key benefit
    if (contextualInfo) {
      const lines = contextualInfo.split('\n');
      const subtitleLine = lines.find(line => 
        line.toLowerCase().includes('tagline') || 
        line.toLowerCase().includes('benefit') ||
        line.toLowerCase().includes('value proposition')
      );
      if (subtitleLine) {
        const extractedSubtitle = subtitleLine.replace(/^[^:]*:?\s*/, '').trim();
        if (extractedSubtitle && extractedSubtitle.length <= 60) {
          return extractedSubtitle;
        }
      }
    }
    
    const subtitles = {
      tech: 'Powered by Innovation',
      luxury: 'Experience Excellence',
      playful: 'Fun Meets Function',
      professional: 'Your Success Partner',
      organic: 'Natural Solutions',
      minimal: 'Simple. Effective.'
    };
    
    return subtitles[analysis.tone] || 'Discover the Difference';
  }
  
  private generateMainText(prompt: string, analysis: ContentAnalysis, contextualInfo?: string | null): string {
    // If we have contextual info, try to extract a compelling CTA message
    if (contextualInfo) {
      const lines = contextualInfo.split('\n');
      const ctaLine = lines.find(line => 
        line.toLowerCase().includes('call to action') || 
        line.toLowerCase().includes('cta') ||
        line.toLowerCase().includes('ready to')
      );
      if (ctaLine) {
        const extractedCta = ctaLine.replace(/^[^:]*:?\s*/, '').trim();
        if (extractedCta && extractedCta.length <= 50) {
          return extractedCta;
        }
      }
    }
    
    const ctaTexts = {
      tech: 'Ready to Innovate?',
      luxury: 'Experience Luxury Today',
      playful: 'Join the Fun!',
      professional: 'Transform Your Business',
      organic: 'Go Natural Today',
      minimal: 'Keep It Simple'
    };
    
    return ctaTexts[analysis.tone] || 'Ready to Get Started?';
  }
  
  private generateButtonText(analysis: ContentAnalysis): string {
    const buttons = {
      tech: 'Launch Now',
      luxury: 'Explore Premium',
      playful: 'Start Playing',
      professional: 'Get Started',
      organic: 'Go Natural',
      minimal: 'Try It'
    };
    
    return buttons[analysis.tone] || 'Start Now';
  }
  
  private generateFeatures(prompt: string, analysis: ContentAnalysis): Array<{ title: string; description: string; emoji: string; color: string }> {
    const featureSets = {
      tech: [
        { title: 'AI-Powered', description: 'Smart automation', emoji: '🤖', color: '#64C8FF' },
        { title: 'Cloud-Based', description: 'Access anywhere', emoji: '☁️', color: '#4ECDC4' },
        { title: 'Secure', description: 'Enterprise-grade security', emoji: '🔒', color: '#FF6B6B' }
      ],
      gaming: [
        { title: 'Epic Graphics', description: 'Stunning visuals', emoji: '🎮', color: '#FF6B6B' },
        { title: 'Multiplayer', description: 'Play with friends', emoji: '👥', color: '#4ECDC4' },
        { title: 'Achievements', description: 'Unlock rewards', emoji: '🏆', color: '#FFE66D' }
      ],
      luxury: [
        { title: 'Premium Quality', description: 'Crafted to perfection', emoji: '💎', color: '#FFD700' },
        { title: 'Exclusive', description: 'Limited edition', emoji: '⭐', color: '#FF6B6B' },
        { title: 'Personalized', description: 'Tailored for you', emoji: '🎯', color: '#4ECDC4' }
      ]
    };
    
    const defaultFeatures = [
      { title: 'Innovation', description: 'Cutting-edge technology', emoji: '🚀', color: '#FF6B6B' },
      { title: 'Quality', description: 'Premium experience', emoji: '⭐', color: '#4ECDC4' },
      { title: 'Performance', description: 'Lightning fast', emoji: '⚡', color: '#FFE66D' }
    ];
    
    return featureSets[analysis.industry as keyof typeof featureSets] || defaultFeatures;
  }
  
  private generateStats(analysis: ContentAnalysis): Array<{ label: string; value: number; suffix: string; color: string }> {
    const statSets = {
      tech: [
        { label: 'Users', value: 100000, suffix: '+', color: '#64C8FF' },
        { label: 'Uptime', value: 99.9, suffix: '%', color: '#4ECDC4' },
        { label: 'Performance', value: 10, suffix: 'x', color: '#FFE66D' }
      ],
      gaming: [
        { label: 'Players', value: 2000000, suffix: '+', color: '#FF6B6B' },
        { label: 'Rating', value: 4.8, suffix: '/5', color: '#FFE66D' },
        { label: 'Downloads', value: 5000000, suffix: '+', color: '#4ECDC4' }
      ],
      luxury: [
        { label: 'Customers', value: 50000, suffix: '+', color: '#FFD700' },
        { label: 'Satisfaction', value: 98, suffix: '%', color: '#FF6B6B' },
        { label: 'Rating', value: 4.9, suffix: '/5', color: '#4ECDC4' }
      ]
    };
    
    const defaultStats = [
      { label: 'Users', value: 50000, suffix: '+', color: '#FF6B6B' },
      { label: 'Rating', value: 4.9, suffix: '/5', color: '#4ECDC4' },
      { label: 'Growth', value: 300, suffix: '%', color: '#FFE66D' }
    ];
    
    return statSets[analysis.industry as keyof typeof statSets] || defaultStats;
  }

  private async getContextualInfo(prompt: string): Promise<string | null> {
    try {
      console.log('🔍 Smart Selector: Fetching contextual info from Senso for:', prompt);
      
      // Use the GET endpoint to get relevant context
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
      const params = new URLSearchParams({
        query: prompt,
        generatePrompt: 'Extract specific details about features, benefits, brand values, and key messaging that would be useful for creating marketing content.',
        maxResults: '2'
      });
      
      console.log('🔍 Smart Selector: Making request to /api/generate with params:', params.toString());
      const response = await fetch(`${baseUrl}/api/generate?${params}`);
      
      if (!response.ok) {
        console.log('🔍 Smart Selector: API response not OK, status:', response.status);
        console.log('🔍 Smart Selector: No contextual info available from Senso');
        return null;
      }
      
      const data = await response.json();
      console.log('🔍 Smart Selector: API response received');
      console.log('🔍 Smart Selector: Context length:', data.output?.length || 0, 'characters');
      console.log('🔍 Smart Selector: Context preview:', data.output?.substring(0, 150) + '...');
      console.log('🔍 Smart Selector: Sources used:', data.sources?.length || 0, 'sources');
      
      return data.output || null;
    } catch (error) {
      console.log('🔍 Smart Selector: Error fetching contextual info, continuing without:', error);
      return null;
    }
  }
}