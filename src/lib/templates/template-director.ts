import Anthropic from '@anthropic-ai/sdk';
import { SCENE_TEMPLATES, TRANSITION_LIBRARY, AUDIO_LIBRARY, getTemplatesByCategory, getTemplatesByStyle, getRandomTemplate } from './scene-templates';
import { SmartTemplateSelector } from './smart-template-selector';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface TemplateVideoStructure {
  scenes: TemplateScene[];
  transitions: TemplateTransition[];
  audio: TemplateAudio;
}

export interface TemplateScene {
  templateId: string;
  durationInFrames: number;
  props: Record<string, unknown>;
}

export interface TemplateTransition {
  type: 'fade' | 'slide' | 'wipe';
  durationInFrames: number;
}

export interface TemplateAudio {
  background: string;
  effects: Array<{
    src: string;
    triggerFrame: number;
    volume: number;
  }>;
}

export class TemplateDirectorAgent {
  private smartSelector = new SmartTemplateSelector();
  
  async planTemplateVideo(prompt: string): Promise<TemplateVideoStructure> {
    console.log('🎬 Template Director: Planning video structure for prompt:', prompt);

    const availableTemplates = SCENE_TEMPLATES.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      complexity: t.complexity,
      visualStyle: t.visualStyle,
      requiredProps: t.requiredProps
    }));

    const availableTransitions = Object.keys(TRANSITION_LIBRARY);
    const availableAudio = AUDIO_LIBRARY;

    const systemPrompt = `You are an AI video director who intelligently selects from advanced Remotion templates to create stunning marketing videos. You MUST only use the provided templates and transitions.

CRITICAL: Return ONLY valid JSON. No explanations. No markdown.

TEMPLATE SELECTION STRATEGY:
- Choose diverse visual styles (futuristic, modern, organic) for variety
- Mix complexity levels (simple, medium, complex) for pacing
- Use advanced templates that showcase Remotion's capabilities
- Match template categories to content flow: hero → features/product → stats → cta
- Consider the prompt's tone (tech = futuristic, luxury = modern, nature = organic)

Available Scene Templates:
${JSON.stringify(availableTemplates, null, 2)}

Available Transitions:
${JSON.stringify(availableTransitions)}

Available Audio:
${JSON.stringify(availableAudio, null, 2)}

CRITICAL REMOTION RULES:
- Use 'width' and 'height' props for shapes, NEVER 'size'
- Import 'random' from 'remotion' for random values, NEVER Math.random()
- Only use imported transitions: fade, slide, wipe
- Always include 'fps' in spring animations

Create a sophisticated video structure by intelligently selecting templates:
- Total duration: 900 frames (30 seconds)
- 4-6 scenes for dynamic pacing
- Each scene 120-200 frames
- Mix visual styles and complexity levels
- Use rich, contextual prop values that match the prompt
- Leverage advanced templates (morphing cards, 3D showcases, neon effects)
- Create visual narrative flow (intro → showcase → proof → action)

JSON Format:
{
  "scenes": [
    {
      "templateId": "hero-animated-title",
      "durationInFrames": 150,
      "props": {
        "title": "Your App Name",
        "subtitle": "Tagline here"
      }
    }
  ],
  "transitions": [
    {
      "type": "fade",
      "durationInFrames": 15
    }
  ],
  "audio": {
    "background": "modern-electronic.mp3",
    "effects": [
      {
        "src": "impact-whoosh.mp3",
        "triggerFrame": 30,
        "volume": 0.5
      }
    ]
  }
}`;

    try {
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Create a visually stunning 30-second marketing video for: "${prompt}". 
            
${this.generateSmartGuidance(prompt)}
            
SELECTION CRITERIA:
1. Choose templates that create visual variety and engagement
2. Use advanced effects (3D, particles, morphing, neon) when appropriate
3. Match visual style to content tone (tech=futuristic, premium=modern)
4. Create narrative flow: hook → showcase → credibility → action
5. Use rich prop values that tell a compelling story
6. Leverage complex templates to showcase Remotion's power
            
Prioritize advanced templates for maximum visual impact.`
          }
        ],
      });

      let response = message.content[0]?.type === 'text' ? message.content[0].text.trim() : '';
      response = this.cleanJsonResponse(response);
      
      console.log('🎬 Template Director: Cleaned response:', response);

      let videoStructure: TemplateVideoStructure;
      try {
        videoStructure = JSON.parse(response);
        console.log('🎬 Template Director: Successfully parsed template structure');
      } catch (parseError) {
        console.error('🎬 Template Director: Failed to parse JSON:', parseError);
        videoStructure = this.createSmartFallbackStructure(prompt);
      }

      // Validate template structure
      videoStructure = this.validateTemplateStructure(videoStructure);
      
      console.log('🎬 Template Director: Final template structure:', JSON.stringify(videoStructure, null, 2));
      return videoStructure;

    } catch (error) {
      console.error('🎬 Template Director: Error planning template structure:', error);
      return this.createSmartFallbackStructure(prompt);
    }
  }
  
  private generateSmartGuidance(prompt: string): string {
    const analysis = this.smartSelector.analyzeContent(prompt);
    const recommendedTemplates = this.smartSelector.selectOptimalTemplates(analysis, 5);
    
    return `SMART ANALYSIS:
- Industry: ${analysis.industry}
- Tone: ${analysis.tone}
- Visual Style: ${analysis.visualStyle}
- Complexity: ${analysis.complexity}
- Recommended Templates: ${recommendedTemplates.join(', ')}
- Suggested Flow: ${analysis.suggestedFlow.join(' → ')}`;
  }
  
  private createSmartFallbackStructure(prompt: string): TemplateVideoStructure {
    const analysis = this.smartSelector.analyzeContent(prompt);
    const recommendedTemplates = this.smartSelector.selectOptimalTemplates(analysis, 5);
    
    console.log('🎬 Using smart fallback with templates:', recommendedTemplates);
    
    const scenes: TemplateScene[] = recommendedTemplates.map((templateId, index) => {
      const props = this.smartSelector.generateContextualProps(prompt, templateId, analysis);
      const duration = index === recommendedTemplates.length - 1 ? 200 : 160 + (index % 2) * 40;
      
      return {
        templateId,
        durationInFrames: duration,
        props
      };
    });
    
    return {
      scenes,
      transitions: scenes.slice(0, -1).map((_, index) => ({
        type: (['wipe', 'fade', 'slide'] as const)[index % 3],
        durationInFrames: 15 + (index % 2) * 5
      })),
      audio: {
        background: analysis.tone === 'tech' ? 'modern-electronic.mp3' : 
                   analysis.tone === 'luxury' ? 'corporate-upbeat.mp3' : 
                   'motivational.mp3',
        effects: [
          { src: 'impact-whoosh.mp3', triggerFrame: 30, volume: 0.5 },
          { src: 'transition-swoosh.mp3', triggerFrame: 190, volume: 0.4 },
          { src: 'transition-swoosh.mp3', triggerFrame: 350, volume: 0.4 },
          { src: 'final-impact.mp3', triggerFrame: 800, volume: 0.6 }
        ]
      }
    };
  }

  private cleanJsonResponse(response: string): string {
    // Remove markdown code blocks
    response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any text before the first {
    const firstBrace = response.indexOf('{');
    if (firstBrace > 0) {
      response = response.substring(firstBrace);
    }
    
    // Remove any text after the last }
    const lastBrace = response.lastIndexOf('}');
    if (lastBrace > 0) {
      response = response.substring(0, lastBrace + 1);
    }
    
    return response.trim();
  }

  private validateTemplateStructure(structure: TemplateVideoStructure): TemplateVideoStructure {
    // Ensure all template IDs exist
    structure.scenes = structure.scenes.filter(scene => 
      SCENE_TEMPLATES.some(template => template.id === scene.templateId)
    );

    // Ensure transitions are valid
    structure.transitions = structure.transitions.filter(transition =>
      Object.keys(TRANSITION_LIBRARY).includes(transition.type)
    );

    // Ensure audio files exist in library
    if (!AUDIO_LIBRARY.background.includes(structure.audio.background)) {
      structure.audio.background = AUDIO_LIBRARY.background[0];
    }

    structure.audio.effects = structure.audio.effects.filter(effect =>
      AUDIO_LIBRARY.effects.includes(effect.src)
    );

    // Validate timing
    let currentFrame = 0;
    structure.scenes.forEach(scene => {
      if (currentFrame + scene.durationInFrames > 900) {
        scene.durationInFrames = 900 - currentFrame;
      }
      currentFrame += scene.durationInFrames;
    });

    return structure;
  }

  private createBasicFallbackStructure(prompt: string): TemplateVideoStructure {
    const title = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
    
    return {
      scenes: [
        {
          templateId: "hero-kinetic-text",
          durationInFrames: 180,
          props: {
            title: title
          }
        },
        {
          templateId: "features-morphing-cards",
          durationInFrames: 200,
          props: {
            features: [
              { title: "Innovation", description: "Cutting-edge technology", color: "#FF6B6B" },
              { title: "Quality", description: "Premium experience", color: "#4ECDC4" },
              { title: "Performance", description: "Lightning fast results", color: "#FFE66D" }
            ]
          }
        },
        {
          templateId: "stats-counter-dynamic",
          durationInFrames: 180,
          props: {
            stats: [
              { label: "Users", value: 50000, suffix: "+", color: "#FF6B6B" },
              { label: "Rating", value: 4.9, suffix: "/5", color: "#4ECDC4" }
            ]
          }
        },
        {
          templateId: "cta-neon-pulse",
          durationInFrames: 160,
          props: {
            mainText: "Ready to Transform?",
            buttonText: "Start Now"
          }
        },
        {
          templateId: "logo-reveal",
          durationInFrames: 180,
          props: {
            brandName: "Your Brand"
          }
        }
      ],
      transitions: [
        { type: "wipe", durationInFrames: 20 },
        { type: "fade", durationInFrames: 15 },
        { type: "slide", durationInFrames: 18 },
        { type: "wipe", durationInFrames: 15 }
      ],
      audio: {
        background: "modern-electronic.mp3",
        effects: [
          { src: "impact-whoosh.mp3", triggerFrame: 30, volume: 0.5 },
          { src: "transition-swoosh.mp3", triggerFrame: 180, volume: 0.4 },
          { src: "transition-swoosh.mp3", triggerFrame: 420, volume: 0.4 }
        ]
      }
    };
  }
}