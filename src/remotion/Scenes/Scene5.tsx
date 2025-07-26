import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mainText = "Join the Elite Dating Experience";
  const buttonText = "Download Now";

  // Liquid morphing background
  const morphOffset1 = interpolate(frame, [0, 180], [0, Math.PI * 2]);
  const morphOffset2 = interpolate(frame, [0, 240], [0, Math.PI * 3]);
  
  const createLiquidPath = (offset: number, amplitude: number) => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * width;
      const y = height / 2 + Math.sin((i / 100) * 8 + offset) * amplitude + 
                Math.sin((i / 100) * 12 + offset * 1.5) * (amplitude * 0.5);
      points.push(`${x},${y}`);
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
          d={`M 0,${height} Q ${createLiquidPath(morphOffset1, 100)} ${width},${height} L ${width},${height} L 0,${height} Z`}
          fill="rgba(255,255,255,0.1)"
          filter="url(#gooey)"
        />
        
        <path
          d={`M 0,0 Q ${createLiquidPath(morphOffset2, 80)} ${width},0 L ${width},0 L 0,0 Z`}
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
          transform: `scale(${textScale}) perspective(1000px) rotateX(${Math.sin(frame * 0.02) * 5}deg)`,
          fontSize: 64,
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          maxWidth: '80%',
          textShadow: '0 10px 30px rgba(0,0,0,0.3)',
          filter: `blur(${Math.max(0, 2 - frame / 10)}px)`
        }}>
          "Join the Elite Dating Experience"
        </div>
        
        {/* Liquid button */}
        <div style={{
          opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' }),
          transform: `scale(${buttonMorph}) perspective(1000px) rotateX(${Math.sin(frame * 0.03) * 3}deg)`,
          background: 'rgba(255,255,255,0.95)',
          color: '#764ba2',
          fontSize: 24,
          fontWeight: 'bold',
          padding: '25px 60px',
          borderRadius: `${30 + Math.sin(frame * 0.1) * 10}px`,
          border: 'none',
          boxShadow: `
            0 15px 35px rgba(0,0,0,0.2),
            inset 0 0 20px rgba(255,255,255,0.1)
          `,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Button liquid effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: `${interpolate(frame, [70, 170], [-100, 100])}%`,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'skewX(-15deg)'
          }} />
          <span style={{ position: 'relative', zIndex: 1 }}>"Download Now"</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { Scene5 };