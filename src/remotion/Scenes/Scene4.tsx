import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle, Rect } from '@remotion/shapes';

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const productName = "BusinessPro Suite";
  const featuresList = ["Intuitive Dashboard","Custom Reports","Mobile Integration"] || ['Premium Quality', 'Fast Performance', 'User Friendly'];

  // 3D rotation effect
  const rotationY = interpolate(frame, [0, 180], [0, 360]);
  const rotationX = Math.sin(frame * 0.02) * 10;
  
  // Product glow effect
  const glowPulse = interpolate((frame % 120), [0, 60, 120], [0.5, 1.2, 0.5]);
  
  // Feature highlights
  const highlightFeature = Math.floor((frame / 60) % featuresList.length);

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(ellipse at center, #0F172A 0%, #1E293B 50%, #334155 100%)',
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
            fontSize: 48,
            color: '#64C8FF',
            textShadow: `0 0 20px #64C8FF`,
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}>
            {productName.split(' ')[0].toUpperCase()}
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
        "BusinessPro Suite"
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
        {featuresList.map((feature, index) => (
          <div
            key={index}
            style={{
              opacity: interpolate(frame - index * 20, [0, 20], [0, 1]),
              transform: `scale(${index === highlightFeature ? 1.1 : 1})`,
              transition: 'transform 0.3s ease',
              fontSize: 18,
              color: index === highlightFeature ? '#60A5FA' : '#E2E8F0',
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

export { Scene4 };