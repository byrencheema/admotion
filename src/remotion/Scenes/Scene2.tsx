import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle } from '@remotion/shapes';

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const features = [{"title":"Trendy Gradient Presets","description":"Amazing trendy gradient presets capability","emoji":"🚀","icon":"circle","color":"#FF6B6B"},{"title":"Engaging Social Effects","description":"Amazing engaging social effects capability","emoji":"⭐","icon":"rect","color":"#4ECDC4"},{"title":"Custom Animation Library","description":"Amazing custom animation library capability","emoji":"⚡","icon":"circle","color":"#FFE66D"},{"title":"One-Click Templates","description":"Amazing one-click templates capability","emoji":"🎯","icon":"rect","color":"#FF8B94"}] || [
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
            transform: `translateX(${cardX}px) perspective(1000px) rotateY(${morph.rotateY}deg) scale(${morph.scale})`,
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
              background: `linear-gradient(145deg, ${feature.color}20, ${feature.color}40)`,
              borderRadius: 20,
              border: `2px solid ${feature.color}`,
              padding: 30,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 15,
              boxShadow: `0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px ${feature.color}30`,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: feature.color,
                textAlign: 'center',
                textShadow: `0 0 10px ${feature.color}`
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

export { Scene2 };