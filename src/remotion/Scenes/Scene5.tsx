import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle } from '@remotion/shapes';

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mainText = "Start Creating Today";
  const buttonText = "Get Started";

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
    const x = random(`particle-x-${i}`) * width;
    const baseY = random(`particle-y-${i}`) * height;
    const floatY = baseY + Math.sin((frame + i * 10) * 0.05) * 20;
    const opacity = interpolate((frame + i * 5) % 180, [0, 90, 180], [0.1, 0.4, 0.1]);
    
    return { x, y: floatY, opacity, size: 2 + random(`particle-size-${i}`) * 3 };
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
        transform: `scale(${textScale})`,
        fontSize: 72,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        maxWidth: '80%',
        textShadow: `
          0 0 ${10 * glowIntensity}px #FF00FF,
          0 0 ${20 * glowIntensity}px #FF00FF,
          0 0 ${30 * glowIntensity}px #FF00FF,
          0 0 ${40 * glowIntensity}px #FF00FF
        `,
        filter: `brightness(${1 + glowIntensity * 0.2})`
      }}>
        "Start Creating Today"
      </div>
      
      {/* Neon button */}
      <div style={{
        opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `scale(${buttonScale})`,
        background: 'transparent',
        border: `3px solid #00FFFF`,
        color: '#00FFFF',
        fontSize: 28,
        fontWeight: 'bold',
        padding: '20px 50px',
        borderRadius: 0,
        position: 'relative',
        boxShadow: `
          inset 0 0 ${20 * glowIntensity}px rgba(0,255,255,0.2),
          0 0 ${20 * glowIntensity}px #00FFFF,
          0 0 ${40 * glowIntensity}px #00FFFF
        `,
        textShadow: `0 0 ${10 * glowIntensity}px #00FFFF`,
        backdropFilter: 'blur(5px)'
      }}>
        {/* Button background glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, transparent, rgba(0,255,255,${0.1 * glowIntensity}), transparent)`,
          animation: 'none'
        }} />
        <span style={{ position: 'relative', zIndex: 1 }}>"Get Started"</span>
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
        boxShadow: `0 0 ${15 * glowIntensity}px #FF00FF`
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
        boxShadow: `0 0 ${15 * glowIntensity}px #00FFFF`
      }} />
    </AbsoluteFill>
  );
};

export { Scene5 };