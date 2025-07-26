import { NextRequest, NextResponse } from 'next/server'
import { readdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const API_BASE = 'https://sdk.senso.ai/api/v1'
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': process.env.SENSO_API_KEY!,
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images')

async function deleteAllContent() {
  console.log('🗑️ Starting content deletion...')
  const all: any[] = []
  let offset = 0
  const limit = 100
  // paginate through content
  while (true) {
    const res = await fetch(`${API_BASE}/content?limit=${limit}&offset=${offset}`, { headers })
    if (!res.ok) {
      throw new Error(`Failed to fetch content: ${res.statusText}`)
    }
    const { items } = await res.json()
    all.push(...items)
    if (items.length < limit) break
    offset += limit
  }
  
  console.log(`🗑️ Found ${all.length} content items to delete`)
  for (const item of all) {
    const deleteRes = await fetch(`${API_BASE}/content/${item.id}`, {
      method: 'DELETE',
      headers,
    })
    if (!deleteRes.ok) {
      console.warn(`⚠️ Failed to delete content ${item.id}: ${deleteRes.statusText}`)
    }
  }
  console.log(`✅ Content deletion completed`)
}

async function deleteAllCategoriesAndTopics() {
  // list all categories
  const res = await fetch(`${API_BASE}/categories?limit=100`, { headers })
  const cats: any[] = await res.json()
  for (const cat of cats) {
    await fetch(`${API_BASE}/categories/${cat.category_id}`, {
      method: 'DELETE',
      headers,
    })
  }
}

async function deleteAllPromptsAndTemplates() {
  // delete prompts
  {
    const res = await fetch(`${API_BASE}/prompts?limit=100`, { headers })
    const prompts: any[] = await res.json()
    for (const p of prompts) {
      await fetch(`${API_BASE}/prompts/${p.prompt_id}`, {
        method: 'DELETE',
        headers,
      })
    }
  }
  // delete templates
  {
    const res = await fetch(`${API_BASE}/templates?limit=100`, { headers })
    const tpls: any[] = await res.json()
    for (const t of tpls) {
      await fetch(`${API_BASE}/templates/${t.template_id}`, {
        method: 'DELETE',
        headers,
      })
    }
  }
}


export async function POST(request: NextRequest) {
  console.log('🔄 Starting workspace refresh...')
  try {
    // Clear Senso workspace only (keep uploaded images)
    await deleteAllContent()
    await deleteAllPromptsAndTemplates()
    await deleteAllCategoriesAndTopics()
    
    console.log('✅ Workspace refresh completed successfully')
    return NextResponse.json({ 
      success: true, 
      message: 'Workspace cleared - Senso workspace refreshed (images preserved)' 
    })
  } catch (err) {
    console.error('❌ Refresh error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to refresh workspace' }, 
      { status: 500 }
    )
  }
}
