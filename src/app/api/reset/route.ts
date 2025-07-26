import { NextResponse } from 'next/server';
import { writeFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

export async function POST() {
  console.log('🔄 API: Resetting generated content...');
  
  try {
    // Reset GeneratedComp to a simple default
    const defaultComponent = `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';

export const GeneratedComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    fps,
    frame,
    config: { damping: 100, stiffness: 200 }
  });
  
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        transform: \`scale(\${scale})\`,
        opacity,
        fontSize: 64,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
      }}>
        Ready to Generate
      </div>
    </AbsoluteFill>
  );
};`;

    // Write default component
    const generatedCompPath = join(process.cwd(), 'src', 'remotion', 'Generated', 'GeneratedComp.tsx');
    writeFileSync(generatedCompPath, defaultComponent);
    console.log('✅ Reset GeneratedComp.tsx to default');

    // Clean up scene files
    try {
      const scenesDir = join(process.cwd(), 'src', 'remotion', 'Scenes');
      const sceneFiles = readdirSync(scenesDir).filter(file => 
        file.startsWith('Scene') && file.endsWith('.tsx')
      );
      
      for (const file of sceneFiles) {
        unlinkSync(join(scenesDir, file));
        console.log(`🗑️ Deleted ${file}`);
      }
    } catch (error) {
      console.warn('⚠️ Could not clean scene files:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Generated content reset successfully! Ready for new generation.'
    });

  } catch (error) {
    console.error('💥 API: Reset failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to reset generated content',
        success: false
      },
      { status: 500 }
    );
  }
}