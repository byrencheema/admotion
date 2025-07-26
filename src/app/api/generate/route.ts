import { NextRequest, NextResponse } from 'next/server';
import { TemplateOrchestrator } from '../../../lib/templates/template-orchestrator';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🔥 API: Starting template-based video generation...');
  
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

    console.log('🎬 API: Initializing template orchestrator...');
    const orchestrator = new TemplateOrchestrator();
    
    console.log('🎭 API: Generating template-based video...');
    const result = await orchestrator.generateTemplateVideo(prompt);
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ API: Template generation took ${duration}ms`);
    
    return NextResponse.json({
      componentCode: result.componentCode || 'No code generated',
      success: result.success,
      message: result.message,
      generationType: 'template-based',
      duration: duration
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('💥 API: Multi-agent generation error after', duration + 'ms:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate multi-scene video content',
        message: 'Multi-agent video generation failed. Check console for details.',
        success: false
      },
      { status: 500 }
    );
  }
}