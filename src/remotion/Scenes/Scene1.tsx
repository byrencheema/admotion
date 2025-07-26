import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from 'remotion';

const Scene1: React.FC<{ title: string; subtitle?: string; images?: string[] }> = ({ title, subtitle, images = [] }) => {
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
        background: `linear-gradient(135deg, rgba(0,0,0,${overlayOpacity}) 0%, rgba(30,30,60,${overlayOpacity * 0.8}) 100%)`,
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
          transform: `scale(${scale})`,
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

export { Scene1 };