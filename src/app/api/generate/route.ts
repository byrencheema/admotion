import { NextRequest, NextResponse } from 'next/server';
import { updateGeneratedComponent } from '../../../lib/dynamic-component';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🔥 API: Starting generation...');
  
  try {
    const { prompt } = await request.json();
    console.log('📝 API: Received prompt:', prompt);

    if (!prompt || typeof prompt !== 'string') {
      console.log('❌ API: Invalid prompt');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('🧠 API: Generating component with OpenAI...');
    
    const systemPrompt = `You are a world-class marketing video expert specializing in creating stunning, conversion-focused, professional marketing videos using Remotion. Create components that drive engagement, build brand awareness, and convert viewers into customers.

IMPORTANT: Return ONLY the component code, no explanations, no markdown code blocks, no extra text.

AVAILABLE ADVANCED TOOLS:
- @remotion/shapes: Circle, Rect, Triangle, Star, Polygon
- @remotion/noise: noise2D, noise3D for organic effects
- @remotion/transitions: fade, slide, wipe effects  
- @remotion/animated-emoji: AnimatedEmoji component
- react-confetti: Confetti component
- CSS gradients, transforms, filters
- Multiple sequences and timing

CREATE MARKETING VIDEOS THAT ARE:
🎯 CONVERSION-FOCUSED: Clear messaging, strong visual hierarchy
🎨 BRAND-PROFESSIONAL: Corporate colors, clean typography, polished look
⚡ ATTENTION-GRABBING: Eye-catching animations that stop the scroll
🌟 SOCIAL-READY: Optimized for Instagram, TikTok, LinkedIn, Twitter
📈 RESULTS-DRIVEN: Designed to increase engagement and conversions

ANIMATION TECHNIQUES:
- Use spring() for organic bouncy movements
- Use interpolate() for smooth transitions
- Combine scale, rotate, opacity, position changes
- Add CSS filters: blur, brightness, contrast
- Use multiple Sequence components for timing
- Create particle/confetti effects
- Add glowing text effects with text-shadow

MARKETING DESIGN PRINCIPLES:
- Brand-appropriate color schemes (corporate blue, luxury gold, tech neon)
- High-contrast text for readability across devices
- Social media optimized layouts and typography
- Call-to-action focused visual hierarchy
- Platform-specific aspect ratios and sizing

Example for "product launch announcement":
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Sequence } from 'remotion';
import { Circle } from '@remotion/shapes';
import { noise2D } from '@remotion/noise';

export const GeneratedComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const mainScale = spring({
    fps, frame, config: { damping: 100, stiffness: 200 }
  });
  
  const glow = interpolate(frame, [0, 60, 120], [0, 1, 0], { 
    extrapolateRight: 'mirror' 
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Sequence from={0} durationInFrames={90}>
        <Circle
          radius={200 * mainScale}
          fill={\`rgba(255,255,255,\${0.1 + glow * 0.3})\`}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: \`blur(\${(1-mainScale)*10}px)\`
          }}
        />
      </Sequence>
      
      <Sequence from={30}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: \`translate(-50%, -50%) scale(\${mainScale})\`,
          fontSize: 72, fontWeight: 'bold', color: 'white',
          textShadow: \`0 0 \${20 + glow*30}px rgba(255,255,255,0.8)\`,
          opacity: interpolate(frame-30, [0,30], [0,1])
        }}>
          NEW PRODUCT
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create a professional marketing video component for: "${prompt}". Focus on brand impact, conversion optimization, and social media engagement with polished animations and marketing-appropriate visual effects!` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const componentCode = completion.choices[0]?.message?.content?.trim() || '';
    console.log('🤖 API: Generated component code:', componentCode);
    
    if (componentCode) {
      console.log('🔄 API: Updating component file...');
      const success = updateGeneratedComponent(componentCode);
      
      if (success) {
        console.log('✅ API: Component updated successfully');
      } else {
        console.log('❌ API: Failed to update component');
      }
    } else {
      console.log('⚠️ API: No component code found in agent response');
    }
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ API: Generation took ${duration}ms`);
    
    const response = {
      componentCode: componentCode || 'No code generated',
      success: componentCode ? true : false,
      message: componentCode ? 'Video generated successfully! Refresh to see changes.' : 'Failed to generate component code'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('💥 API: Generation error after', duration + 'ms:', error);
    return NextResponse.json(
      { error: 'Failed to generate video content' },
      { status: 500 }
    );
  }
}