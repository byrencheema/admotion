import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Sequence } from 'remotion';
import { Circle } from '@remotion/shapes';
import { noise2D } from '@remotion/noise';
import Confetti from 'react-confetti';

export const GeneratedComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  
  const mainScale = spring({
    fps, frame, config: { damping: 100, stiffness: 200 }
  });
  
  const glow = interpolate(frame, [0, 60, 120], [0, 1, 0], { 
    extrapolateRight: 'clamp' 
  });

  const confettiProgress = interpolate(frame, [0, durationInFrames], [0, 100]);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Sequence from={0} durationInFrames={90}>
        <Circle
          radius={200 * mainScale}
          fill={`rgba(255,255,255,${0.1 + glow * 0.3})`}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: `blur(${(1-mainScale)*10}px)`
          }}
        />
      </Sequence>
      
      <Sequence from={30}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${mainScale})`,
          fontSize: 72, fontWeight: 'bold', color: 'white',
          textShadow: `0 0 ${20 + glow*30}px rgba(255,255,255,0.8)`,
          opacity: interpolate(frame-30, [0,30], [0,1])
        }}>
          WELCOME
        </div>
      </Sequence>
      
      <Sequence from={60} durationInFrames={30}>
        <Confetti
          width={width}
          height={height}
          numberOfPieces={confettiProgress}
          recycle={false}
        />
      </Sequence>
    </AbsoluteFill>
  );
};