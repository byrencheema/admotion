import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, AbsoluteFill } from 'remotion';

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const title = "Streamline Your Workflow" || 'HELLO';
  const text = title.toUpperCase();

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {text.split('').map((char, i) => {
          const delay = i * 8;
          const scale = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: {
              damping: 8,
              mass: 0.3,
              stiffness: 100
            }
          });

          const colors = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#1e40af'];
          const charColor = colors[i % colors.length];

          return (
            <div
              key={i}
              style={{
                display: 'inline-block',
                transform: `scale(${scale})`,
                fontSize: 80,
                fontWeight: 'bold',
                color: 'white',
                border: '6px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: 120,
                height: 120,
                lineHeight: '108px',
                textAlign: 'center',
                background: `linear-gradient(45deg, ${charColor}, ${charColor}dd)`,
                boxShadow: `0 8px 25px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255,255,255,0.1)`,
                backdropFilter: 'blur(8px)'
              }}
            >
              {char === ' ' ? '' : char}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export { Scene1 };