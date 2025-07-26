import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle, Rect } from '@remotion/shapes';

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const productName = "The Royal Collection";
  const features = ["18K Gold Craftsmanship","Rare Diamond Selection","Artisan Design","Limited Edition"] || ['Premium Quality', 'Fast Performance', 'User Friendly'];

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
        transform: `perspective(1000px) rotateY(${rotationY}deg) rotateX(${rotationX}deg) scale(1.2)`,
        width: 300,
        height: 300
      }}>
        {/* Main product shape */}
        <div style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(145deg, 
            rgba(255,255,255,0.1) 0%, 
            rgba(100,200,255,0.3) 50%, 
            rgba(255,255,255,0.1) 100%)
          `,
          borderRadius: '20px',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: `
            0 0 ${30 * glowPulse}px rgba(100,200,255,0.5),
            inset 0 0 50px rgba(255,255,255,0.1)
          `,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Product icon/logo */}
          <div style={{
            fontSize: 80,
            color: '#64C8FF',
            textShadow: `0 0 20px #64C8FF`,
            transform: `rotateY(${-rotationY}deg)` // Counter-rotate to keep icon upright
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
        "The Royal Collection"
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
              transform: `scale(${index === highlightFeature ? 1.1 : 1})`,
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

export { Scene2 };