import { SCENE_TEMPLATES, TRANSITION_LIBRARY } from './scene-templates';
import { TemplateVideoStructure, TemplateScene } from './template-director';

export class TemplateGeneratorAgent {
  generateSceneComponents(videoStructure: TemplateVideoStructure): Record<string, string> {
    console.log('🎭 Template Generator: Generating scenes from templates');
    
    const sceneComponents: Record<string, string> = {};
    
    videoStructure.scenes.forEach((scene, index) => {
      const sceneName = `Scene${index + 1}`;
      const componentCode = this.generateSceneFromTemplate(scene, sceneName);
      sceneComponents[sceneName] = componentCode;
      
      console.log(`🎭 Template Generator: Generated ${sceneName} from template ${scene.templateId}`);
    });
    
    return sceneComponents;
  }

  private generateSceneFromTemplate(scene: TemplateScene, sceneName: string): string {
    const template = SCENE_TEMPLATES.find(t => t.id === scene.templateId);
    
    if (!template) {
      console.warn(`🎭 Template Generator: Template ${scene.templateId} not found, using fallback`);
      return this.createFallbackScene(sceneName);
    }

    // Replace template placeholders with actual values
    let componentCode = template.code;
    
    // Replace scene name placeholder
    componentCode = componentCode.replace(/{SCENE_NAME}/g, sceneName);
    
    // Validate required props
    const missingProps = template.requiredProps.filter(prop => !(prop in scene.props));
    if (missingProps.length > 0) {
      console.warn(`🎭 Template Generator: Missing props for ${sceneName}:`, missingProps);
      // Add default values for missing props
      missingProps.forEach(prop => {
        scene.props[prop] = this.getDefaultPropValue(prop);
      });
    }

    // Replace prop placeholders with actual values in the component
    componentCode = this.injectPropsIntoTemplate(componentCode, scene.props, template.id);

    console.log(`🎭 Template Generator: Using template ${template.id} for ${sceneName} with props:`, scene.props);
    
    return componentCode;
  }

  private injectPropsIntoTemplate(componentCode: string, props: Record<string, unknown>, templateId: string): string {
    // Replace template placeholders with actual prop values
    
    // Hero templates  
    if (templateId === 'hero-animated-title' || templateId === 'hero-kinetic-text' || templateId === 'hero-3d-float' || templateId === 'hero-bubble-text' || templateId === 'hero-typewriter' || templateId === 'hero-retro-neon') {
      componentCode = componentCode.replace(/{title}/g, `"${props.title || 'Your Amazing Title'}"`);
      componentCode = componentCode.replace(/{subtitle}/g, props.subtitle ? `"${props.subtitle}"` : 'undefined');
    } else if (templateId === 'logo-reveal') {
      componentCode = componentCode.replace(/{brandName}/g, `"${props.brandName || 'Your Brand'}"`);
    } else if (templateId === 'cta-button') {
      componentCode = componentCode.replace(/{mainText}/g, `"${props.mainText || 'Your Message'}"`);
      componentCode = componentCode.replace(/{buttonText}/g, `"${props.buttonText || 'Click Here'}"`);
    // Feature templates
    } else if (templateId === 'features-morphing-cards' || templateId === 'features-wave-reveal' || templateId === 'features-animated-list' || templateId === 'features-holographic-cards') {
      let features;
      if (Array.isArray(props.features)) {
        if (props.features.length > 0 && typeof props.features[0] === 'string') {
          // Convert string array to enhanced object array
          features = (props.features as string[]).map((title, index) => ({
            title,
            description: `Amazing ${title.toLowerCase()} capability`,
            emoji: ['🚀', '⭐', '⚡', '🎯', '💎', '🔥'][index % 6],
            icon: index % 2 === 0 ? 'circle' : 'rect',
            color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8B94', '#A8E6CF', '#FFB6C1'][index % 6]
          }));
        } else {
          features = props.features;
        }
      } else {
        features = [
          { title: 'Innovation', description: 'Cutting-edge technology', emoji: '🚀', color: '#FF6B6B' },
          { title: 'Quality', description: 'Premium experience', emoji: '⭐', color: '#4ECDC4' },
          { title: 'Speed', description: 'Lightning fast', emoji: '⚡', color: '#FFE66D' }
        ];
      }
      componentCode = componentCode.replace(/{features}/g, JSON.stringify(features));
    
    // Product templates
    } else if (templateId === 'product-showcase-3d') {
      componentCode = componentCode.replace(/{productName}/g, `"${props.productName || 'Amazing Product'}"`);      
      let features;
      if (Array.isArray(props.features)) {
        features = props.features;
      } else {
        features = ['Premium Quality', 'Fast Performance', 'User Friendly'];
      }
      componentCode = componentCode.replace(/{features}/g, JSON.stringify(features));
    
    // Stats templates
    } else if (templateId === 'stats-counter-dynamic' || templateId === 'stats-chart-animated' || templateId === 'stats-circular-progress') {
      let stats;
      if (Array.isArray(props.stats)) {
        // Ensure all stats have required fields
        stats = props.stats.map((stat, index) => ({
          ...stat,
          color: stat.color || ['#4361ee', '#f72585', '#4cc9f0', '#4895ef', '#560bad'][index % 5],
          suffix: stat.suffix || (typeof stat.value === 'number' && stat.value > 100 ? '+' : '%')
        }));
      } else {
        stats = [
          { label: 'Users', value: 50000, suffix: '+', color: '#4361ee' },
          { label: 'Downloads', value: 100000, suffix: '+', color: '#f72585' },
          { label: 'Rating', value: 4.9, suffix: '/5', color: '#4cc9f0' }
        ];
      }
      componentCode = componentCode.replace(/{stats}/g, JSON.stringify(stats));
    
    // CTA templates
    } else if (templateId === 'cta-neon-pulse' || templateId === 'cta-liquid-morph') {
      componentCode = componentCode.replace(/{mainText}/g, `"${props.mainText || 'Ready to Get Started?'}"`);      
      componentCode = componentCode.replace(/{buttonText}/g, `"${props.buttonText || 'Start Now'}"`);      
    }
    
    // Background templates
    if (templateId === 'background-liquid-wave') {
      // No props needed for this template
    }

    return componentCode;
  }

  private getDefaultPropValue(propName: string): unknown {
    const defaults: Record<string, unknown> = {
      title: 'Your Amazing Title',
      subtitle: 'Discover Something Incredible',
      mainText: 'Ready to Get Started?',
      buttonText: 'Start Now',
      brandName: 'Your Brand',
      productName: 'Amazing Product',
      features: [
        { title: 'Innovation', description: 'Cutting-edge technology', emoji: '🚀', color: '#FF6B6B' },
        { title: 'Quality', description: 'Premium experience', emoji: '⭐', color: '#4ECDC4' },
        { title: 'Speed', description: 'Lightning fast', emoji: '⚡', color: '#FFE66D' }
      ],
      stats: [
        { label: 'Users', value: 50000, suffix: '+', color: '#FF6B6B' },
        { label: 'Downloads', value: 100000, suffix: '+', color: '#4ECDC4' },
        { label: 'Rating', value: 4.9, suffix: '/5', color: '#FFE66D' }
      ]
    };

    return defaults[propName] || 'Default Value';
  }

  private createFallbackScene(sceneName: string): string {
    return `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

const ${sceneName}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 200 }
  });
  
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        transform: \`scale(\${scale})\`,
        opacity,
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
      }}>
        Template Scene
      </div>
    </AbsoluteFill>
  );
};

export { ${sceneName} };`;
  }

  generateMasterComposition(
    videoStructure: TemplateVideoStructure, 
    sceneComponents: Record<string, string>
  ): string {
    console.log('🎬 Template Generator: Generating master composition');

    // Generate imports for used transitions
    const usedTransitions = new Set(videoStructure.transitions.map(t => t.type));
    const transitionImports = Array.from(usedTransitions)
      .map(type => TRANSITION_LIBRARY[type as keyof typeof TRANSITION_LIBRARY].import)
      .join('\n');

    // Generate scene imports
    const sceneImports = Object.keys(sceneComponents)
      .map(sceneName => `import { ${sceneName} } from '../Scenes/${sceneName}';`)
      .join('\n');

    // Generate audio components
    const audioComponents = this.generateAudioComponents(videoStructure);

    // Generate scene sequences with transitions
    const sceneSequences = videoStructure.scenes.map((scene, index) => {
      const sceneName = `Scene${index + 1}`;
      const transition = videoStructure.transitions[index];
      
      let sequenceCode = `
        <TransitionSeries.Sequence durationInFrames={${scene.durationInFrames}}>
          <${sceneName} />
        </TransitionSeries.Sequence>`;

      if (transition && index < videoStructure.scenes.length - 1) {
        sequenceCode += `
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: ${transition.durationInFrames}})}
          presentation={${transition.type}()}
        />`;
      }

      return sequenceCode;
    }).join('');

    const masterComponent = `import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
${transitionImports}
${sceneImports}

export const GeneratedComp: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Audio Layer */}
      ${audioComponents}
      
      {/* Scene Transitions */}
      <TransitionSeries>
        ${sceneSequences}
      </TransitionSeries>
    </AbsoluteFill>
  );
};`;

    console.log('🎬 Template Generator: Master composition generated successfully');
    return masterComponent;
  }

  private generateAudioComponents(videoStructure: TemplateVideoStructure): string {
    const audioComponents = [];
    
    // Background music throughout the video
    audioComponents.push(`
      {/* Background Music */}
      <Audio src={staticFile('audio/background/relaxing-guitar-loop.mp3')} volume={0.15} />`);
    
    // Sound effects for transitions - start 30 frames (1 second) before transition
    let currentFrame = 0;
    videoStructure.scenes.forEach((scene, index) => {
      currentFrame += scene.durationInFrames;
      
      // Add transition sound effects
      if (index < videoStructure.scenes.length - 1) {
        const transition = videoStructure.transitions[index];
        if (transition) {
          const effectFile = transition.type === 'slide' ? 'whoosh-short-realistic.mp3' : 'bubble-pop.mp3';
          const startFrame = Math.max(0, currentFrame - 30); // Start 1 second (30 frames) early
          audioComponents.push(`
      {/* Transition effect for ${transition.type} */}
      <Sequence from={${startFrame}} durationInFrames={${transition.durationInFrames + 30}}>
        <Audio src={staticFile('audio/effects/${effectFile}')} volume={0.4} />
      </Sequence>`);
          currentFrame += transition.durationInFrames;
        }
      }
    });
    
    return audioComponents.join('');
  }
}