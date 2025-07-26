import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from 'remotion';

const Scene3: React.FC<{ productName: string; features: string[]; images?: string[] }> = ({ 
  productName, 
  features = [], 
  images = [] 
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const productImage = images.find(img => img.includes('product')) || images[0];
  
  const slideIn = spring({
    fps,
    frame: frame - 30,
    config: { damping: 200, stiffness: 100 }
  });

  const imageScale = interpolate(frame, [0, 60], [1.2, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '60px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%'
      }}>
        {/* Product Image */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {productImage && (
            <div style={{
              transform: `scale(${imageScale})`,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              maxWidth: '400px',
              maxHeight: '400px'
            }}>
              <Img
                src={staticFile(productImage.replace('/uploads', 'uploads'))}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          paddingLeft: '60px',  
          transform: `translateX(${interpolate(slideIn, [0, 1], [100, 0])}px)`
        }}>
          <h1 style={{
            fontSize: 54,
            fontWeight: '900',
            color: '#1e293b',
            marginBottom: '30px',
            lineHeight: 1.2,
            opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            {productName}
          </h1>
          
          <div style={{
            opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                style={{
                  fontSize: 24,
                  color: '#475569',
                  marginBottom: '20px',
                  opacity: interpolate(frame, [90 + index * 20, 120 + index * 20], [0, 1], { extrapolateRight: 'clamp' }),
                  transform: `translateX(${interpolate(frame, [90 + index * 20, 120 + index * 20], [30, 0])}px)`
                }}
              >
                ✨ {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { Scene3 };