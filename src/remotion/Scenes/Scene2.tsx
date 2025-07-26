import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = {features} || [
    { title: 'Neural Networks', description: 'AI-powered processing', emoji: '🧠', color: '#64C8FF' },
    { title: 'Quantum Speed', description: 'Instant calculations', emoji: '⚡', color: '#FF6B9D' },
    { title: 'Holographic UI', description: 'Next-gen interface', emoji: '🔮', color: '#9B59B6' }
  ];

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(ellipse at center, #0D1421 0%, #1A1A2E 50%, #16213E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 60,
      padding: 80
    }}>
      {features.map((feature, index) => {
        const delay = index * 20;
        const cardScale = spring({
          fps,
          frame: frame - delay,
          config: { damping: 200, stiffness: 150 }
        });
        
        const prismEffect = Math.sin((frame + index * 50) * 0.05) * 5;
        
        return (
          <div
            key={index}
            style={{
              transform: `scale(${cardScale}) translateY(${prismEffect}px)`,
              opacity: interpolate(frame - delay, [0, 30], [0, 1]),
              width: 280,
              height: 350,
              position: 'relative',
              borderRadius: 20,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(100,200,255,0.2) 50%, rgba(255,255,255,0.05) 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 30px rgba(100,200,255,0.3), inset 0 0 50px rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              padding: 30
            }}
          >
            <div style={{
              fontSize: 48,
              marginBottom: 10,
              filter: 'drop-shadow(0 0 10px #64C8FF)'
            }}>
              {feature.emoji || '⭐'}
            </div>
            
            <div style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: 10,
              textShadow: '0 0 10px #64C8FF'
            }}>
              {feature.title}
            </div>
            
            <div style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              {feature.description}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export { Scene2 };