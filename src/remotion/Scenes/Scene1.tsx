import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const title = "Create Stunning Instagram Stories That Convert";
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
            [random(`word-x-${i}`) * 200 - 100, 0],
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
            [random(`word-rot-${i}`) * 40 - 20, 0],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                transform: `scale(${scale}) translateX(${slideX}px) rotateZ(${rotateZ}deg)`,
                opacity,
                fontSize: 64,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textShadow: '0 0 20px rgba(255,255,255,0.5)',
                filter: `blur(${Math.max(0, 10 - frame / 5)}px)`
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

export { Scene1 };