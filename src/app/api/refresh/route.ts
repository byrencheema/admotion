import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://sdk.senso.ai/api/v1'
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': process.env.SENSO_API_KEY!,
}

async function deleteAllContent() {
  const all: any[] = []
  let offset = 0
  const limit = 100
  // paginate through content
  while (true) {
    const res = await fetch(`${API_BASE}/content?limit=${limit}&offset=${offset}`, { headers })
    const { items } = await res.json()
    all.push(...items)
    if (items.length < limit) break
    offset += limit
  }
  for (const item of all) {
    await fetch(`${API_BASE}/content/${item.id}`, {
      method: 'DELETE',
      headers,
    })
  }
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
  try {
    await deleteAllContent()
    await deleteAllPromptsAndTemplates()
    await deleteAllCategoriesAndTopics()
    return NextResponse.json({ success: true, message: 'Senso workspace cleared' })
  } catch (err) {
    console.error('Senso refresh error', err)
    return NextResponse.json(
      { success: false, error: 'Failed to refresh Senso workspace' }, 
      { status: 500 }
    )
  }
}
