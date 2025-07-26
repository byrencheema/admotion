import { NextRequest, NextResponse } from 'next/server';
import { TemplateOrchestrator } from '../../../lib/templates/template-orchestrator';

const API_BASE = 'https://sdk.senso.ai/api/v1';
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': process.env.SENSO_API_KEY!,
};

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

    // First, sync Senso taxonomy to ensure proper categorization
    console.log('🏗️ API: Syncing Senso taxonomy...');
    try {
      await syncSensoTaxonomy();
      console.log('✅ API: Senso taxonomy sync completed');
    } catch (error) {
      console.warn('⚠️ API: Senso taxonomy sync failed, continuing anyway:', error);
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

// Senso taxonomy interfaces
interface CanonicalTopic { 
  name: string; 
  description?: string;
}

interface CanonicalCategory { 
  name: string; 
  description?: string; 
  topics: CanonicalTopic[];
}

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const maxResults = parseInt(searchParams.get('maxResults') || '5');
  const generatePrompt = searchParams.get('generatePrompt');

  console.log('🔍 GET /api/generate - Starting Senso context retrieval');
  console.log('🔍 Query:', query);
  console.log('🔍 Generate Prompt:', generatePrompt);
  console.log('🔍 Max Results:', maxResults);

  if (!query || !generatePrompt) {
    console.log('❌ Missing required parameters');
    return NextResponse.json(
      { error: 'Missing `query` or `generatePrompt` in query parameters' },
      { status: 400 }
    );
  }

  if (!process.env.SENSO_API_KEY) {
    console.log('❌ Missing SENSO_API_KEY environment variable');
    return NextResponse.json(
      { error: 'SENSO_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    // 1. Get existing content
    console.log('📋 Step 1: Fetching existing Senso content...');
    const contentRes = await fetch(`${API_BASE}/content?limit=100`, { headers });
    const contentData = await contentRes.json();
    const contentIds = contentData.items?.map((c: any) => c.id) || [];

    console.log('📋 Found', contentIds.length, 'content items in Senso');
    console.log('📋 Content IDs:', contentIds.slice(0, 5), contentIds.length > 5 ? '...' : '');

    if (contentIds.length === 0) {
      console.log('❌ No Senso content found');
      return NextResponse.json(
        { error: 'No Senso content found' },
        { status: 404 }
      );
    }

    // 2. Perform semantic search on the corpus
    console.log('🔍 Step 2: Performing semantic search with query:', query);
    const searchRes = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, max_results: maxResults }),
    });
    const searchResult = await searchRes.json();
    console.log('🔍 Search results received:', searchResult.results?.length || 0, 'chunks');

    const chunks = searchResult.results || [];
    const selectedContentIds = Array.from(new Set(chunks.map((c: any) => c.content_id)));
    console.log('🔍 Selected content IDs for generation:', selectedContentIds);

    if (selectedContentIds.length === 0) {
      console.log('❌ No relevant content found for query:', query);
      return NextResponse.json(
        { error: 'No relevant content found for query' },
        { status: 404 }
      );
    }

    // 3. Generate from selected content
    console.log('🔍 Step 3: Generating content with prompt:', generatePrompt);
    console.log('🔍 Using content IDs:', selectedContentIds);
    const genRes = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content_type: query,
        instructions: generatePrompt,
        content_ids: selectedContentIds,
        max_results: 1,
        save: false,
      }),
    });

    if (!genRes.ok) {
      const msg = await genRes.text();
      console.log('❌ Generate API failed:', msg);
      return NextResponse.json(
        { error: `Generate failed: ${msg}` },
        { status: 500 }
      );
    }

    const genData = await genRes.json();
    console.log('✅ Generated content successfully');
    console.log('🔍 Generated text length:', genData.generated_text?.length || 0, 'characters');
    console.log('🔍 Generated text preview:', genData.generated_text?.substring(0, 200) + '...');
    console.log('🔍 Sources used:', genData.sources?.length || 0, 'sources');

    console.log('🔍 Returning context response to caller');
    return NextResponse.json({
      prompt: generatePrompt,
      sources: genData.sources,
      output: genData.generated_text,
    });
  } catch (error) {
    console.error('🔥 Senso context generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}