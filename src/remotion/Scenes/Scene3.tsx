import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [{"label":"Engagement Rate","value":"85%"},{"label":"Brand Recognition","value":"3x"},{"label":"Conversion Rate","value":"45%"}] || [
    { label: 'Users', value: 50000, suffix: '+', color: '#FF6B6B' },
    { label: 'Downloads', value: 100000, suffix: '+', color: '#4ECDC4' },
    { label: 'Rating', value: 4.9, suffix: '/5', color: '#FFE66D' }
  ];

  const containerScale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 200 }
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 80
    }}>
      {stats.map((stat, index) => {
        const startFrame = index * 30;
        const progress = interpolate(
          frame - startFrame,
          [0, 90],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );
        
        const countValue = interpolate(
          progress,
          [0, 1],
          [0, stat.value],
          { extrapolateRight: 'clamp' }
        );
        
        const scaleEffect = spring({
          fps,
          frame: frame - startFrame,
          config: { damping: 200, stiffness: 300 }
        });
        
        const displayValue = stat.value < 10 
          ? countValue.toFixed(1)
          : Math.floor(countValue).toLocaleString();

        return (
          <div
            key={index}
            style={{
              transform: `scale(${scaleEffect})`,
              opacity: interpolate(frame - startFrame, [0, 20], [0, 1]),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20
            }}
          >
            {/* Progress ring */}
            <div style={{
              position: 'relative',
              width: 120,
              height: 120
            }}>
              <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx={60}
                  cy={60}
                  r={50}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={8}
                />
                <circle
                  cx={60}
                  cy={60}
                  r={50}
                  fill="none"
                  stroke={stat.color}
                  strokeWidth={8}
                  strokeDasharray={`${314 * progress} 314`}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 10px ${stat.color})`
                  }}
                />
              </svg>
              
              {/* Counter display */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: stat.color,
                  textShadow: `0 0 10px ${stat.color}`
                }}>
                  {displayValue}{stat.suffix}
                </div>
              </div>
            </div>
            
            {/* Label */}
            <div style={{
              fontSize: 22,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {stat.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export { Scene3 };