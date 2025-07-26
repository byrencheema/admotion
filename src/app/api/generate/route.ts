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

// SENSO STUFF - NEED TO ADD TO ENDPOINT ^^ LATER
// Note: Next.js App Router has built-in fetch, no need to import

const API_BASE = 'https://sdk.senso.ai/api/v1';
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': process.env.SENSO_API_KEY!,
};

interface CanonicalTopic { name: string; description?: string }
interface CanonicalCategory { name: string; description?: string; topics: CanonicalTopic[] }

const canonicalTaxonomy: CanonicalCategory[] = [
  {
    name: "Product Assets",
    topics: [{ name: "Product specifications", description: "Tech specs, sheets" }],
  },
  {
    name: "Marketing Content",
    topics: [
      { name: "Taglines & slogans" },
      { name: "Ad copy", description: "Video scripts, web banners" },
      { name: "Campaign briefs" },
    ],
  },
];

async function syncSensoTaxonomy() {
  // 1. Fetch existing categories + topics
  const resp = await fetch(`${API_BASE}/categories/all`, { headers });
  if (!resp.ok) throw new Error(`Failed to list categories: ${resp.statusText}`);
  const existing = await resp.json() as Array<{ category_id: string; name: string; topics: { name: string; topic_id: string; }[] }>;

  // 2. Process each canonical category
  for (const cat of canonicalTaxonomy) {
    const found = existing.find(c => c.name === cat.name);
    if (!found) {
      // create new category + nested topics
      const body = { categories: [ { name: cat.name, description: cat.description, topics: cat.topics } ] };
      const createResp = await fetch(`${API_BASE}/categories/batch-create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!createResp.ok) throw new Error(`Failed batch-create category ${cat.name}: ${await createResp.text()}`);
      console.log(`Created category "${cat.name}" with topics.`);
    } else {
      // check for missing topics
      const existingTopicNames = found.topics.map(t => t.name);
      const missingTopics = cat.topics.filter(t => !existingTopicNames.includes(t.name));
      if (missingTopics.length > 0) {
        const tBody = { topics: missingTopics };
        const tResp = await fetch(`${API_BASE}/categories/${found.category_id}/topics/batch-create`, {
          method: 'POST',
          headers,
          body: JSON.stringify(tBody),
        });
        if (!tResp.ok) throw new Error(`Failed to create topics in ${cat.name}: ${await tResp.text()}`);
        console.log(`Created ${missingTopics.length} topic(s) in "${cat.name}"`);
      }
    }
  }
}