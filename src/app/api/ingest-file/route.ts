import { NextRequest, NextResponse } from 'next/server'

const SENSO_API = 'https://sdk.senso.ai/api/v1'
const POLL_INTERVAL_MS = 1000
const MAX_POLL_ATTEMPTS = 30

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File too large. Maximum size is 20MB.' }, { status: 400 })
    }

    const sensoForm = new FormData()
    sensoForm.append('file', file, file.name)
    sensoForm.append('title', file.name)

    const uploadRes = await fetch(`${SENSO_API}/content/file`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.SENSO_API_KEY!,
        // No Content-Type manually set for FormData
      },
      body: sensoForm,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.json()
      console.error('Senso upload error:', err)
      return NextResponse.json(
        { success: false, error: err.error || 'Senso upload failed' },
        { status: uploadRes.status }
      )
    }

    const { id: contentId, processing_status } = await uploadRes.json()

    console.log(`📁 Senso content created: ${contentId}, status: ${processing_status}`)

    // Poll until processing_status === "completed"
    let finalStatus = processing_status
    let attempts = 0

    while (finalStatus !== 'completed' && attempts < MAX_POLL_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
      attempts++

      const statusRes = await fetch(`${SENSO_API}/content/${contentId}`, {
        headers: { 'X-API-Key': process.env.SENSO_API_KEY! },
      })

      if (!statusRes.ok) {
        const msg = await statusRes.text()
        return NextResponse.json({ success: false, error: `Polling failed: ${msg}` }, { status: 500 })
      }

      const statusData = await statusRes.json()
      finalStatus = statusData.processing_status
      console.log(`⏳ Poll ${attempts}: status = ${finalStatus}`)
    }

    if (finalStatus !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'Senso processing timeout' },
        { status: 504 }
      )
    }

    return NextResponse.json({
      success: true,
      contentId,
      processingStatus: finalStatus,
      message: 'Senso content processed and ready',
    })
  } catch (error) {
    console.error('Upload + Poll error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
