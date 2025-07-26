import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, random } from 'remotion';
import { Circle, Rect } from '@remotion/shapes';

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const title = "Elite Singles";
  const subtitle = "Where Luxury Meets Love";

  // 3D floating elements
  const floatingElements = Array.from({ length: 12 }, (_, i) => {
    const baseX = random(`float-x-${i}`) * width;
    const baseY = random(`float-y-${i}`) * height;
    
    const floatX = interpolate(
      (frame + i * 10) % 180,
      [0, 90, 180],
      [baseX - 50, baseX + 50, baseX - 50]
    );
    
    const floatY = interpolate(
      (frame + i * 15) % 240,
      [0, 120, 240],
      [baseY - 30, baseY + 30, baseY - 30]
    );
    
    const rotateZ = interpolate(frame + i * 5, [0, 180], [0, 360]);
    const scale = 0.8 + Math.sin((frame + i * 20) * 0.05) * 0.3;
    const opacity = 0.1 + Math.sin((frame + i * 12) * 0.03) * 0.1;
    
    return { x: floatX, y: floatY, rotate: rotateZ, scale, opacity, type: i % 3 };
  });

  const titleScale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 200 }
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0F0C29 0%, #302B63 50%, #24243e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20
    }}>
      {/* Floating 3D elements */}
      {floatingElements.map((element, i) => {
        const size = 20 + (i % 3) * 15;
        const color = ['#FF6B6B', '#4ECDC4', '#FFE66D'][element.type];
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              transform: `scale(${element.scale}) rotateZ(${element.rotate}deg)`,
              opacity: element.opacity,
              filter: 'blur(1px)'
            }}
          >
            {element.type === 0 && (
              <Circle
                width={size}
                height={size}
                color={color}
                x={0}
                y={0}
              />
            )}
            {element.type === 1 && (
              <Rect
                width={size}
                height={size}
                color={color}
                x={0}
                y={0}
              />
            )}
            {element.type === 2 && (
              <div style={{
                width: size,
                height: size,
                background: color,
                borderRadius: '30%',
                transform: 'rotateX(45deg)'
              }} />
            )}
          </div>
        );
      })}
      
      <div style={{
        transform: `scale(${titleScale}) perspective(1000px) rotateX(5deg)`,
        fontSize: 72,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
        zIndex: 10
      }}>
        "Elite Singles"
      </div>
      
      {subtitle && (
        <div style={{
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
          fontSize: 32,
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          transform: 'perspective(1000px) rotateX(5deg)',
          zIndex: 10
        }}>
          "Where Luxury Meets Love"
        </div>
      )}
    </AbsoluteFill>
  );
};

export { Scene1 };