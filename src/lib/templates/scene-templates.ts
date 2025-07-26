export interface SceneTemplate {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'features' | 'testimonials' | 'cta' | 'logo' | 'product' | 'stats' | 'transition';
  code: string;
  requiredProps: string[];
  complexity: 'simple' | 'medium' | 'complex';
  visualStyle: 'minimal' | 'modern' | 'futuristic' | 'organic' | 'retro';
}

export const SCENE_TEMPLATES: SceneTemplate[] = [
  {
    id: 'hero-image-overlay', 
    name: 'Hero with Image Background',
    description: 'Hero text overlaid on uploaded background image with cinematic effects',
    category: 'hero',
    complexity: 'medium',
    visualStyle: 'modern',
    requiredProps: ['title', 'subtitle', 'images'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from 'remotion';

const {SCENE_NAME}: React.FC<{ title: string; subtitle?: string; images?: string[] }> = ({ title, subtitle, images = [] }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 100 }
  });
  
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const backgroundImage = images[0];
  const overlayOpacity = interpolate(frame, [0, 60], [0.7, 0.4]);

  return (
    <AbsoluteFill>
      {/* Background Image */}
      {backgroundImage && (
        <Img
          src={staticFile(backgroundImage.replace('/uploads', 'uploads'))}
          style={{
            width: width,
            height: height,
            objectFit: 'cover',
            filter: 'blur(2px) brightness(0.7)'
          }}
        />
      )}
      
      {/* Dark Overlay */}
      <AbsoluteFill style={{
        background: \`linear-gradient(135deg, rgba(0,0,0,\${overlayOpacity}) 0%, rgba(30,30,60,\${overlayOpacity * 0.8}) 100%)\`,
      }} />
      
      {/* Content */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{
          transform: \`scale(\${scale})\`,
          opacity,
          fontSize: 72,
          fontWeight: '900',
          color: 'white',
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          marginBottom: '20px',
          maxWidth: '80%',
          lineHeight: 1.2
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{
            opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            maxWidth: '70%',
            lineHeight: 1.4
          }}>
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'hero-animated-title',
    name: 'Animated Hero Title',
    description: 'Large animated title with spring animation',
    category: 'hero',
    complexity: 'medium',
    visualStyle: 'modern',
    requiredProps: ['title', 'subtitle'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 200 }
  });

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const title = {title};
  const subtitle = {subtitle};

  // Animated background particles
  const particles = Array.from({ length: 50 }, (_, i) => {
    const x = random(\`particle-x-\${i}\`) * width;
    const y = random(\`particle-y-\${i}\`) * height;
    const delay = random(\`particle-delay-\${i}\`) * 60;
    const particleOpacity = interpolate(frame - delay, [0, 60, 120], [0, 0.3, 0]);
    const size = 2 + random(\`particle-size-\${i}\`) * 4;
    
    return { x, y, opacity: particleOpacity, size };
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20
    }}>
      {/* Animated particles background */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '50%',
            opacity: particle.opacity,
          }}
        />
      ))}
      
      <div style={{
        transform: \`scale(\${scale})\`,
        opacity,
        fontSize: 72,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
          fontSize: 32,
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'hero-kinetic-text',
    name: 'Kinetic Typography Hero',
    description: 'Dynamic word-by-word text animation with motion blur effects',
    category: 'hero',
    complexity: 'complex',
    visualStyle: 'futuristic',
    requiredProps: ['title'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const title = {title};
  const words = title.split(' ');

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(circle at center, #2D1B69 0%, #11052C 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        maxWidth: '80%'
      }}>
        {words.map((word, i) => {
          const wordDelay = i * 8;
          const scale = spring({
            fps,
            frame: frame - wordDelay,
            config: { damping: 200, stiffness: 300 }
          });
          
          const slideX = interpolate(
            frame - wordDelay,
            [0, 20],
            [random(\`word-x-\${i}\`) * 200 - 100, 0],
            { extrapolateRight: 'clamp' }
          );
          
          const opacity = interpolate(
            frame - wordDelay,
            [0, 15, 120, 135],
            [0, 1, 1, 0]
          );
          
          const rotateZ = interpolate(
            frame - wordDelay,
            [0, 20],
            [random(\`word-rot-\${i}\`) * 40 - 20, 0],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                transform: \`scale(\${scale}) translateX(\${slideX}px) rotateZ(\${rotateZ}deg)\`,
                opacity,
                fontSize: 64,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textShadow: '0 0 20px rgba(255,255,255,0.5)',
                filter: \`blur(\${Math.max(0, 10 - frame / 5)}px)\`
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'hero-3d-float',
    name: '3D Floating Elements Hero',
    description: 'Hero with 3D floating geometric elements',
    category: 'hero',
    complexity: 'complex',
    visualStyle: 'modern',
    requiredProps: ['title', 'subtitle'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle, Rect } from '@remotion/shapes';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const title = {title};
  const subtitle = {subtitle};

  // 3D floating elements
  const floatingElements = Array.from({ length: 12 }, (_, i) => {
    const baseX = random(\`float-x-\${i}\`) * width;
    const baseY = random(\`float-y-\${i}\`) * height;
    
    const floatX = interpolate(
      (frame + i * 10) % 180,
      [0, 90, 180],
      [baseX - 50, baseX + 50, baseX - 50]
    );
    
    const floatY = interpolate(
      (frame + i * 15) % 240,
      [0, 120, 240],
      [baseY - 30, baseY + 30, baseY - 30]
    );
    
    const rotateZ = interpolate(frame + i * 5, [0, 180], [0, 360]);
    const scale = 0.8 + Math.sin((frame + i * 20) * 0.05) * 0.3;
    const opacity = 0.1 + Math.sin((frame + i * 12) * 0.03) * 0.1;
    
    return { x: floatX, y: floatY, rotate: rotateZ, scale, opacity, type: i % 3 };
  });

  const titleScale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 200 }
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0F0C29 0%, #302B63 50%, #24243e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20
    }}>
      {/* Floating 3D elements */}
      {floatingElements.map((element, i) => {
        const size = 20 + (i % 3) * 15;
        const color = ['#FF6B6B', '#4ECDC4', '#FFE66D'][element.type];
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              transform: \`scale(\${element.scale}) rotateZ(\${element.rotate}deg)\`,
              opacity: element.opacity,
              filter: 'blur(1px)'
            }}
          >
            {element.type === 0 && (
              <Circle
                width={size}
                height={size}
                color={color}
                x={0}
                y={0}
              />
            )}
            {element.type === 1 && (
              <Rect
                width={size}
                height={size}
                color={color}
                x={0}
                y={0}
              />
            )}
            {element.type === 2 && (
              <div style={{
                width: size,
                height: size,
                background: color,
                borderRadius: '30%',
                transform: 'rotateX(45deg)'
              }} />
            )}
          </div>
        );
      })}
      
      <div style={{
        transform: \`scale(\${titleScale}) perspective(1000px) rotateX(5deg)\`,
        fontSize: 72,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
        zIndex: 10
      }}>
        {title}
      </div>
      
      {subtitle && (
        <div style={{
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
          fontSize: 32,
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          transform: 'perspective(1000px) rotateX(5deg)',
          zIndex: 10
        }}>
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'features-morphing-cards',
    name: 'Morphing Feature Cards',
    description: 'Features displayed as morphing 3D cards with particle effects',
    category: 'features',
    complexity: 'complex',
    visualStyle: 'futuristic',
    requiredProps: ['features'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle } from '@remotion/shapes';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const features = {features} || [
    { title: 'Feature 1', description: 'Amazing capability', color: '#FF6B6B' },
    { title: 'Feature 2', description: 'Powerful tool', color: '#4ECDC4' },
    { title: 'Feature 3', description: 'Easy to use', color: '#FFE66D' }
  ];

  // Card morphing animation
  const cardMorph = (index: number) => {
    const startFrame = index * 30;
    const progress = spring({
      fps,
      frame: frame - startFrame,
      config: { damping: 300, stiffness: 400 }
    });
    
    const rotateY = interpolate(progress, [0, 1], [90, 0]);
    const scale = interpolate(progress, [0, 0.5, 1], [0.5, 1.1, 1]);
    const opacity = interpolate(frame - startFrame, [0, 20], [0, 1]);
    
    return { rotateY, scale, opacity };
  };

  // Particle system for each card
  const generateParticles = (cardIndex: number) => {
    return Array.from({ length: 20 }, (_, i) => {
      const particleFrame = frame - cardIndex * 30 - 10;
      const angle = (i / 20) * Math.PI * 2;
      const radius = interpolate(particleFrame, [0, 60], [0, 100]);
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const opacity = interpolate(particleFrame, [0, 30, 60], [0, 0.6, 0]);
      
      return { x, y, opacity };
    });
  };

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 60
    }}>
      {features.map((feature, index) => {
        const morph = cardMorph(index);
        const particles = generateParticles(index);
        const cardX = (index - 1) * 320;
        
        return (
          <div key={index} style={{
            position: 'relative',
            transform: \`translateX(\${cardX}px) perspective(1000px) rotateY(\${morph.rotateY}deg) scale(\${morph.scale})\`,
            opacity: morph.opacity,
          }}>
            {/* Particle effects */}
            {particles.map((particle, i) => (
              <Circle
                key={i}
                x={particle.x}
                y={particle.y}
                width={4}
                height={4}
                color={feature.color}
                opacity={particle.opacity}
              />
            ))}
            
            {/* Card */}
            <div style={{
              width: 280,
              height: 200,
              background: \`linear-gradient(145deg, \${feature.color}20, \${feature.color}40)\`,
              borderRadius: 20,
              border: \`2px solid \${feature.color}\`,
              padding: 30,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 15,
              boxShadow: \`0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px \${feature.color}30\`,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: feature.color,
                textAlign: 'center',
                textShadow: \`0 0 10px \${feature.color}\`
              }}>
                {feature.title}
              </div>
              <div style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                {feature.description || 'Amazing feature'}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'features-wave-reveal',
    name: 'Wave Reveal Features',
    description: 'Features revealed by animated wave effects',
    category: 'features',
    complexity: 'complex',
    visualStyle: 'organic',
    requiredProps: ['features'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const features = {features} || [
    { title: 'Innovation', emoji: '🚀' },
    { title: 'Quality', emoji: '⭐' },
    { title: 'Speed', emoji: '⚡' }
  ];

  // Wave animation
  const waveOffset = interpolate(frame, [0, 120], [0, Math.PI * 4]);
  
  const createWave = (amplitude: number, frequency: number, phase: number) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * width;
      const y = height / 2 + Math.sin((i / 100) * frequency + waveOffset + phase) * amplitude;
      return { x, y };
    });
  };

  const wave1 = createWave(50, 8, 0);
  const wave2 = createWave(30, 12, Math.PI / 3);
  const wave3 = createWave(40, 6, Math.PI / 2);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      overflow: 'hidden'
    }}>
      {/* Animated wave backgrounds */}
      <svg width={width} height={height} style={{ position: 'absolute', opacity: 0.3 }}>
        <path
          d={\`M 0 \${height} L \${wave1.map(p => \`\${p.x} \${p.y}\`).join(' L ')} L \${width} \${height} Z\`}
          fill="url(#gradient1)"
        />
        <path
          d={\`M 0 \${height} L \${wave2.map(p => \`\${p.x} \${p.y}\`).join(' L ')} L \${width} \${height} Z\`}
          fill="url(#gradient2)"
        />
        <path
          d={\`M 0 \${height} L \${wave3.map(p => \`\${p.x} \${p.y}\`).join(' L ')} L \${width} \${height} Z\`}
          fill="url(#gradient3)"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE66D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFE66D" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Feature items */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100%',
        padding: '0 100px',
        zIndex: 10
      }}>
        {features.map((feature, index) => {
          const appearDelay = index * 40;
          const scale = spring({
            fps,
            frame: frame - appearDelay,
            config: { damping: 200, stiffness: 300 }
          });
          
          const float = Math.sin((frame + index * 30) * 0.05) * 10;
          const glow = interpolate((frame + index * 20) % 120, [0, 60, 120], [0.5, 1, 0.5]);
          
          return (
            <div
              key={index}
              style={{
                transform: \`scale(\${scale}) translateY(\${float}px)\`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                opacity: interpolate(frame - appearDelay, [0, 20], [0, 1])
              }}
            >
              <div style={{
                fontSize: 80,
                filter: \`drop-shadow(0 0 \${20 * glow}px currentColor)\`,
                transform: \`rotateY(\${Math.sin(frame * 0.02 + index) * 20}deg)\`
              }}>
                {feature.emoji || '✨'}
              </div>
              <div style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}>
                {feature.title}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'cta-neon-pulse',
    name: 'Neon Pulse CTA',
    description: 'Futuristic neon-style call-to-action with pulse effects',
    category: 'cta',
    complexity: 'complex',
    visualStyle: 'futuristic',
    requiredProps: ['mainText', 'buttonText'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle } from '@remotion/shapes';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mainText = {mainText};
  const buttonText = {buttonText};

  // Neon glow pulse
  const glowIntensity = interpolate((frame % 60), [0, 30, 60], [0.5, 1.5, 0.5]);
  
  // Main text animation
  const textScale = spring({
    fps,
    frame,
    config: { damping: 300, stiffness: 400 }
  });

  // Button hover effect simulation
  const buttonScale = interpolate(
    Math.sin(frame * 0.1) + 1,
    [0, 2],
    [1, 1.05]
  );

  // Floating particles
  const particles = Array.from({ length: 30 }, (_, i) => {
    const x = random(\`particle-x-\${i}\`) * width;
    const baseY = random(\`particle-y-\${i}\`) * height;
    const floatY = baseY + Math.sin((frame + i * 10) * 0.05) * 20;
    const opacity = interpolate((frame + i * 5) % 180, [0, 90, 180], [0.1, 0.4, 0.1]);
    
    return { x, y: floatY, opacity, size: 2 + random(\`particle-size-\${i}\`) * 3 };
  });

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #1a0033 50%, #000000 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 60
    }}>
      {/* Animated particles */}
      {particles.map((particle, i) => (
        <Circle
          key={i}
          x={particle.x}
          y={particle.y}
          width={particle.size}
          height={particle.size}
          color="#FF00FF"
          opacity={particle.opacity}
        />
      ))}
      
      {/* Main text with neon effect */}
      <div style={{
        transform: \`scale(\${textScale})\`,
        fontSize: 72,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        maxWidth: '80%',
        textShadow: \`
          0 0 \${10 * glowIntensity}px #FF00FF,
          0 0 \${20 * glowIntensity}px #FF00FF,
          0 0 \${30 * glowIntensity}px #FF00FF,
          0 0 \${40 * glowIntensity}px #FF00FF
        \`,
        filter: \`brightness(\${1 + glowIntensity * 0.2})\`
      }}>
        {mainText}
      </div>
      
      {/* Neon button */}
      <div style={{
        opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
        transform: \`scale(\${buttonScale})\`,
        background: 'transparent',
        border: \`3px solid #00FFFF\`,
        color: '#00FFFF',
        fontSize: 28,
        fontWeight: 'bold',
        padding: '20px 50px',
        borderRadius: 0,
        position: 'relative',
        boxShadow: \`
          inset 0 0 \${20 * glowIntensity}px rgba(0,255,255,0.2),
          0 0 \${20 * glowIntensity}px #00FFFF,
          0 0 \${40 * glowIntensity}px #00FFFF
        \`,
        textShadow: \`0 0 \${10 * glowIntensity}px #00FFFF\`,
        backdropFilter: 'blur(5px)'
      }}>
        {/* Button background glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: \`linear-gradient(45deg, transparent, rgba(0,255,255,\${0.1 * glowIntensity}), transparent)\`,
          animation: 'none'
        }} />
        <span style={{ position: 'relative', zIndex: 1 }}>{buttonText}</span>
      </div>
      
      {/* Corner effects */}
      <div style={{
        position: 'absolute',
        top: 50,
        left: 50,
        width: 100,
        height: 100,
        border: '2px solid #FF00FF',
        borderBottom: 'none',
        borderRight: 'none',
        opacity: 0.6,
        boxShadow: \`0 0 \${15 * glowIntensity}px #FF00FF\`
      }} />
      <div style={{
        position: 'absolute',
        bottom: 50,
        right: 50,
        width: 100,
        height: 100,
        border: '2px solid #00FFFF',
        borderTop: 'none',
        borderLeft: 'none',
        opacity: 0.6,
        boxShadow: \`0 0 \${15 * glowIntensity}px #00FFFF\`
      }} />
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'cta-liquid-morph',
    name: 'Liquid Morph CTA',
    description: 'Organic liquid morphing effects with call-to-action',
    category: 'cta',
    complexity: 'complex',
    visualStyle: 'organic',
    requiredProps: ['mainText', 'buttonText'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mainText = {mainText};
  const buttonText = {buttonText};

  // Liquid morphing background
  const morphOffset1 = interpolate(frame, [0, 180], [0, Math.PI * 2]);
  const morphOffset2 = interpolate(frame, [0, 240], [0, Math.PI * 3]);
  
  const createLiquidPath = (offset: number, amplitude: number) => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * width;
      const y = height / 2 + Math.sin((i / 100) * 8 + offset) * amplitude + 
                Math.sin((i / 100) * 12 + offset * 1.5) * (amplitude * 0.5);
      points.push(\`\${x},\${y}\`);
    }
    return points.join(' ');
  };

  const textScale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 300 }
  });

  const buttonMorph = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.95, 1.05]
  );

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
      {/* Liquid morphing background */}
      <svg width={width} height={height} style={{ position: 'absolute' }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" />
            <feComposite in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>
        
        <path
          d={\`M 0,\${height} Q \${createLiquidPath(morphOffset1, 100)} \${width},\${height} L \${width},\${height} L 0,\${height} Z\`}
          fill="rgba(255,255,255,0.1)"
          filter="url(#gooey)"
        />
        
        <path
          d={\`M 0,0 Q \${createLiquidPath(morphOffset2, 80)} \${width},0 L \${width},0 L 0,0 Z\`}
          fill="rgba(255,255,255,0.05)"
          filter="url(#gooey)"
        />
      </svg>
      
      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 50,
        zIndex: 10
      }}>
        {/* Morphing text */}
        <div style={{
          transform: \`scale(\${textScale}) perspective(1000px) rotateX(\${Math.sin(frame * 0.02) * 5}deg)\`,
          fontSize: 64,
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          maxWidth: '80%',
          textShadow: '0 10px 30px rgba(0,0,0,0.3)',
          filter: \`blur(\${Math.max(0, 2 - frame / 10)}px)\`
        }}>
          {mainText}
        </div>
        
        {/* Liquid button */}
        <div style={{
          opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' }),
          transform: \`scale(\${buttonMorph}) perspective(1000px) rotateX(\${Math.sin(frame * 0.03) * 3}deg)\`,
          background: 'rgba(255,255,255,0.95)',
          color: '#764ba2',
          fontSize: 24,
          fontWeight: 'bold',
          padding: '25px 60px',
          borderRadius: \`\${30 + Math.sin(frame * 0.1) * 10}px\`,
          border: 'none',
          boxShadow: \`
            0 15px 35px rgba(0,0,0,0.2),
            inset 0 0 20px rgba(255,255,255,0.1)
          \`,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Button liquid effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: \`\${interpolate(frame, [70, 170], [-100, 100])}%\`,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'skewX(-15deg)'
          }} />
          <span style={{ position: 'relative', zIndex: 1 }}>{buttonText}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'logo-reveal',
    name: 'Logo Reveal',
    description: 'Animated logo with brand name',
    category: 'logo',
    complexity: 'medium',
    visualStyle: 'modern',
    requiredProps: ['brandName'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle } from '@remotion/shapes';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const brandName = {brandName};
  const logoColor = '#ff4b6e';

  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 100;
    
    const targetX = width / 2 + Math.cos(angle) * radius;
    const targetY = height / 2 + Math.sin(angle) * radius * 0.8;
    
    const startX = width / 2 + random(\`particle-x-\${i}\`) * 400 - 200;
    const startY = height / 2 + random(\`particle-y-\${i}\`) * 400 - 200;
    
    const progress = spring({
      fps,
      frame: frame - i * 0.5,
      config: {
        damping: 200,
        stiffness: 200,
      },
    });

    const x = interpolate(progress, [0, 1], [startX, targetX]);
    const y = interpolate(progress, [0, 1], [startY, targetY]);

    return { x, y };
  });

  const titleOpacity = interpolate(
    frame,
    [60, 90],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: '#1a1a1a' }}>
      {particles.map((particle, i) => (
        <Circle
          key={i}
          x={particle.x || 0}
          y={particle.y || 0}
          width={30}
          height={30}
          color={logoColor}
          opacity={0.8}
        />
      ))}
      <div style={{
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        top: '60%',
        opacity: titleOpacity,
        fontSize: 64,
        fontWeight: 'bold',
        color: 'white',
      }}>
        {brandName}
      </div>
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'product-showcase-3d',
    name: '3D Product Showcase',
    description: 'Rotating 3D product display with dynamic lighting',
    category: 'product',
    complexity: 'complex',
    visualStyle: 'modern',
    requiredProps: ['productName', 'features'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle, Rect } from '@remotion/shapes';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const productName = {productName};
  const features = {features} || ['Premium Quality', 'Fast Performance', 'User Friendly'];

  // 3D rotation effect
  const rotationY = interpolate(frame, [0, 180], [0, 360]);
  const rotationX = Math.sin(frame * 0.02) * 10;
  
  // Product glow effect
  const glowPulse = interpolate((frame % 120), [0, 60, 120], [0.5, 1.2, 0.5]);
  
  // Feature highlights
  const highlightFeature = Math.floor((frame / 60) % features.length);

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(ellipse at center, #2C3E50 0%, #4A6741 30%, #1A1A1A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* 3D Product representation */}
      <div style={{
        position: 'relative',
        transform: \`perspective(1000px) rotateY(\${rotationY}deg) rotateX(\${rotationX}deg) scale(1.2)\`,
        width: 300,
        height: 300
      }}>
        {/* Main product shape */}
        <div style={{
          width: '100%',
          height: '100%',
          background: \`linear-gradient(145deg, 
            rgba(255,255,255,0.1) 0%, 
            rgba(100,200,255,0.3) 50%, 
            rgba(255,255,255,0.1) 100%)
          \`,
          borderRadius: '20px',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: \`
            0 0 \${30 * glowPulse}px rgba(100,200,255,0.5),
            inset 0 0 50px rgba(255,255,255,0.1)
          \`,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Product icon/logo */}
          <div style={{
            fontSize: 80,
            color: '#64C8FF',
            textShadow: \`0 0 20px #64C8FF\`,
            transform: \`rotateY(\${-rotationY}deg)\` // Counter-rotate to keep icon upright
          }}>
            📱
          </div>
        </div>
        
        {/* Floating particles around product */}
        {Array.from({ length: 15 }, (_, i) => {
          const angle = (i / 15) * Math.PI * 2;
          const radius = 200 + Math.sin((frame + i * 10) * 0.05) * 30;
          const x = Math.cos(angle + frame * 0.02) * radius;
          const y = Math.sin(angle + frame * 0.02) * radius * 0.6;
          
          return (
            <Circle
              key={i}
              x={x}
              y={y}
              width={4}
              height={4}
              color="#64C8FF"
              opacity={0.6}
            />
          );
        })}
      </div>
      
      {/* Product name */}
      <div style={{
        position: 'absolute',
        top: '15%',
        width: '100%',
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        opacity: interpolate(frame, [0, 30], [0, 1])
      }}>
        {productName}
      </div>
      
      {/* Features list */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: 40
      }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              opacity: interpolate(frame - index * 20, [0, 20], [0, 1]),
              transform: \`scale(\${index === highlightFeature ? 1.1 : 1})\`,
              transition: 'transform 0.3s ease',
              fontSize: 18,
              color: index === highlightFeature ? '#64C8FF' : '#FFFFFF',
              textShadow: index === highlightFeature ? '0 0 10px #64C8FF' : 'none',
              fontWeight: index === highlightFeature ? 'bold' : 'normal'
            }}
          >
            {feature}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'stats-counter-dynamic',
    name: 'Dynamic Stats Counter',
    description: 'Animated statistics with dynamic counters and progress bars',
    category: 'stats',
    complexity: 'medium',
    visualStyle: 'modern',
    requiredProps: ['stats'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

const {SCENE_NAME}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = {stats} || [
    { label: 'Users', value: 50000, suffix: '+', color: '#FF6B6B' },
    { label: 'Downloads', value: 100000, suffix: '+', color: '#4ECDC4' },
    { label: 'Rating', value: 4.9, suffix: '/5', color: '#FFE66D' }
  ];

  const containerScale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 200 }
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 80
    }}>
      {stats.map((stat, index) => {
        const startFrame = index * 30;
        const progress = interpolate(
          frame - startFrame,
          [0, 90],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );
        
        const countValue = interpolate(
          progress,
          [0, 1],
          [0, stat.value],
          { extrapolateRight: 'clamp' }
        );
        
        const scaleEffect = spring({
          fps,
          frame: frame - startFrame,
          config: { damping: 200, stiffness: 300 }
        });
        
        const displayValue = stat.value < 10 
          ? countValue.toFixed(1)
          : Math.floor(countValue).toLocaleString();

        return (
          <div
            key={index}
            style={{
              transform: \`scale(\${scaleEffect})\`,
              opacity: interpolate(frame - startFrame, [0, 20], [0, 1]),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20
            }}
          >
            {/* Progress ring */}
            <div style={{
              position: 'relative',
              width: 120,
              height: 120
            }}>
              <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx={60}
                  cy={60}
                  r={50}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={8}
                />
                <circle
                  cx={60}
                  cy={60}
                  r={50}
                  fill="none"
                  stroke={stat.color}
                  strokeWidth={8}
                  strokeDasharray={\`\${314 * progress} 314\`}
                  strokeLinecap="round"
                  style={{
                    filter: \`drop-shadow(0 0 10px \${stat.color})\`
                  }}
                />
              </svg>
              
              {/* Counter display */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: stat.color,
                  textShadow: \`0 0 10px \${stat.color}\`
                }}>
                  {displayValue}{stat.suffix}
                </div>
              </div>
            </div>
            
            {/* Label */}
            <div style={{
              fontSize: 22,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {stat.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  },
  {
    id: 'product-image-showcase',
    name: 'Product Image Showcase', 
    description: 'Dynamic product presentation using uploaded product images',
    category: 'product',
    complexity: 'medium',
    visualStyle: 'modern',
    requiredProps: ['productName', 'features', 'images'],
    code: `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from 'remotion';

const {SCENE_NAME}: React.FC<{ productName: string; features: string[]; images?: string[] }> = ({ 
  productName, 
  features = [], 
  images = [] 
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const productImage = images.find(img => img.includes('product')) || images[0];
  
  const slideIn = spring({
    fps,
    frame: frame - 30,
    config: { damping: 200, stiffness: 100 }
  });

  const imageScale = interpolate(frame, [0, 60], [1.2, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '60px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%'
      }}>
        {/* Product Image */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {productImage && (
            <div style={{
              transform: \`scale(\${imageScale})\`,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              maxWidth: '400px',
              maxHeight: '400px'
            }}>
              <Img
                src={staticFile(productImage.replace('/uploads', 'uploads'))}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          paddingLeft: '60px',  
          transform: \`translateX(\${interpolate(slideIn, [0, 1], [100, 0])}px)\`
        }}>
          <h1 style={{
            fontSize: 54,
            fontWeight: '900',
            color: '#1e293b',
            marginBottom: '30px',
            lineHeight: 1.2,
            opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            {productName}
          </h1>
          
          <div style={{
            opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                style={{
                  fontSize: 24,
                  color: '#475569',
                  marginBottom: '20px',
                  opacity: interpolate(frame, [90 + index * 20, 120 + index * 20], [0, 1], { extrapolateRight: 'clamp' }),
                  transform: \`translateX(\${interpolate(frame, [90 + index * 20, 120 + index * 20], [30, 0])}px)\`
                }}
              >
                ✨ {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { {SCENE_NAME} };`
  }
];

export const TRANSITION_LIBRARY = {
  fade: { name: 'fade', import: "import { fade } from '@remotion/transitions/fade';" },
  slide: { name: 'slide', import: "import { slide } from '@remotion/transitions/slide';" },
  wipe: { name: 'wipe', import: "import { wipe } from '@remotion/transitions/wipe';" }
};

// Template selection helpers
export const getTemplatesByCategory = (category: string) => {
  return SCENE_TEMPLATES.filter(template => template.category === category);
};

export const getTemplatesByComplexity = (complexity: 'simple' | 'medium' | 'complex') => {
  return SCENE_TEMPLATES.filter(template => template.complexity === complexity);
};

export const getTemplatesByStyle = (style: string) => {
  return SCENE_TEMPLATES.filter(template => template.visualStyle === style);
};

export const getRandomTemplate = (category?: string) => {
  const templates = category ? getTemplatesByCategory(category) : SCENE_TEMPLATES;
  return templates[Math.floor(Math.random() * templates.length)];
};

export const AUDIO_LIBRARY = {
  background: [
    'modern-electronic.mp3',
    'corporate-upbeat.mp3',
    'motivational.mp3'
  ],
  effects: [
    'impact-whoosh.mp3',
    'transition-swoosh.mp3',
    'text-appear.mp3',
    'final-impact.mp3'
  ]
};