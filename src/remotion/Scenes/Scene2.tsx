import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const statsData = [{"label":"Productivity Increase","value":85,"color":"#4361ee","suffix":"%"},{"label":"Time Saved","value":65,"color":"#f72585","suffix":"%"},{"label":"Team Efficiency","value":92,"color":"#4cc9f0","suffix":"%"}] || [
    { label: 'Jan', value: 50 },
    { label: 'Feb', value: 80 },
    { label: 'Mar', value: 30 },
    { label: 'Apr', value: 70 },
    { label: 'May', value: 90 }
  ];

  const colors = [
    '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0',
    '#4895ef', '#560bad', '#b5179e', '#f15bb5', '#00b4d8'
  ];

  const chartWidth = 900;
  const chartHeight = 500;
  const padding = 60;

  const xScale = (x) => (x / (statsData.length - 1)) * (chartWidth - padding * 2) + padding;
  const yScale = (y) => chartHeight - padding - (y / 100) * (chartHeight - padding * 2);
  const barWidth = ((chartWidth - padding * 2) / statsData.length) * 0.7;

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(to bottom right, #111827, #1f2937)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        position: 'relative',
        width: chartWidth,
        height: chartHeight,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 16,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        padding: 20
      }}>
        <svg width={chartWidth} height={chartHeight}>
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* X-axis line */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
          />

          {/* X-axis labels */}
          {statsData.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={xScale(i)}
              y={chartHeight - padding + 25}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.8)"
              fontSize="14"
              fontWeight="500"
            >
              {point.label}
            </text>
          ))}

          {/* Animated bars */}
          {statsData.map((point, i) => {
            const numericValue = typeof point.value === 'string' 
              ? parseFloat(point.value.replace(/[^0-9.]/g, '')) || 50
              : point.value;
              
            const barHeight = (numericValue / 100) * (chartHeight - padding * 2);
            
            const barProgress = interpolate(
              frame,
              [i * 5, 20 + i * 5],
              [0, 1],
              { extrapolateRight: 'clamp' }
            );

            const currentHeight = barHeight * barProgress;
            const currentY = chartHeight - padding - currentHeight;

            return (
              <g key={`bar-${i}`}>
                <rect
                  x={xScale(i) - barWidth / 2}
                  y={currentY}
                  width={barWidth}
                  height={currentHeight}
                  fill={colors[i % colors.length]}
                  rx="6"
                  ry="6"
                  filter="url(#shadow)"
                />
                <text
                  x={xScale(i)}
                  y={currentY - 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  opacity={barProgress > 0.9 ? 1 : 0}
                >
                  {typeof point.value === 'string' ? point.value : numericValue}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Chart title */}
        <div style={{
          position: 'absolute',
          top: 25,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 28,
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          letterSpacing: '-0.5px',
          opacity: titleOpacity
        }}>
          Performance Analytics
        </div>

        {/* Chart subtitle */}
        <div style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.7)',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          opacity: titleOpacity
        }}>
          Data visualization dashboard
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { Scene2 };