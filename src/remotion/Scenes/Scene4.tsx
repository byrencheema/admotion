import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rawStats = [{"label":"Success Rate","value":89,"color":"#4361ee","suffix":"%"},{"label":"Verified Users","value":95,"color":"#f72585","suffix":"%"},{"label":"Elite Members","value":78,"color":"#4cc9f0","suffix":"%"}] || [
    { label: 'Success Rate', value: 85, suffix: '%', color: '#4361ee' },
    { label: 'Users', value: 12000, suffix: '+', color: '#f72585' },
    { label: 'Rating', value: 4.8, suffix: '/5', color: '#4cc9f0' }
  ];
  
  // Ensure all stats have colors
  const stats = rawStats.map((stat, index) => ({
    ...stat,
    color: stat.color || ['#4361ee', '#f72585', '#4cc9f0', '#4895ef', '#560bad'][index % 5],
    suffix: stat.suffix || ''
  }));

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 100
    }}>
      {stats.map((stat, index) => {
        const startFrame = index * 20;
        const progress = interpolate(
          frame - startFrame,
          [0, 90],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );
        
        const numericValue = typeof stat.value === 'string' 
          ? parseFloat(stat.value.replace(/[^0-9.]/g, '')) || 80
          : stat.value;
          
        const progressPercent = Math.min(numericValue, 100);
        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (progressPercent / 100) * circumference * progress;
        
        const pulse = 1 + Math.sin(frame / 15) * 0.03;
        
        const displayValue = typeof stat.value === 'string'
          ? stat.value
          : (numericValue < 10 
            ? (numericValue * progress).toFixed(1)
            : Math.floor(numericValue * progress).toLocaleString());

        return (
          <div
            key={index}
            style={{
              position: 'relative',
              width: 250,
              height: 250,
              transform: `scale(${pulse})`,
              opacity: interpolate(frame - startFrame, [0, 20], [0, 1])
            }}
          >
            {/* Background circle */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 200"
              style={{
                position: 'absolute',
                transform: 'rotate(-90deg)'
              }}
            >
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgba(30, 41, 59, 0.2)"
                strokeWidth="12"
              />
            </svg>
            
            {/* Progress circle */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 200"
              style={{
                position: 'absolute',
                transform: 'rotate(-90deg)'
              }}
            >
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={stat.color || '#4361ee'}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 10px ${stat.color || '#4361ee'})`
                }}
              />
            </svg>
            
            {/* Value display */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: 8
              }}>
                {displayValue}{stat.suffix || ''}
              </div>
              <div style={{
                fontSize: 18,
                color: '#475569',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export { Scene4 };