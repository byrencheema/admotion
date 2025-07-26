import { NextRequest, NextResponse } from 'next/server';

// POST calls senso's /content/file endpoint
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (50MB limit)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 20MB.' },
        { status: 400 }
      );
    }

    const sensoForm = new FormData();
    sensoForm.append('file', file, file.name);
    sensoForm.append('title', file.name);
    // Optional: add a summary
    // sensoForm.append('summary', 'Uploaded via Next.js endpoint');

    const res = await fetch('https://sdk.senso.ai/api/v1/content/file', {
      method: 'POST',
      headers: { 'X-API-Key': process.env.SENSO_API_KEY! },
      body: sensoForm,
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Senso error', err);
      return NextResponse.json({ success: false, error: err.error || 'Senso upload failed' }, { status: res.status });
    }

    const data = await res.json();
    // data.id is the Senso content ID and processing_status is queued/processing/completed :contentReference[oaicite:1]{index=1}

    console.log(`📁 Senso content created: ${data.id}, status: ${data.processing_status}`);

    return NextResponse.json({
      success: true,
      contentId: data.id,
      processingStatus: data.processing_status,
      message: 'Sent to Senso for indexing',
    });
  } catch (error) {
    console.error('Upload error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}