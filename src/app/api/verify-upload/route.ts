import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');

export async function GET() {
  try {
    console.log('📁 Verifying upload directory:', UPLOAD_DIR);
    
    if (!existsSync(UPLOAD_DIR)) {
      console.log('❌ Upload directory does not exist');
      return NextResponse.json({
        exists: false,
        error: 'Upload directory does not exist',
        path: UPLOAD_DIR
      });
    }

    const files = await readdir(UPLOAD_DIR);
    console.log('📁 Files in upload directory:', files);

    return NextResponse.json({
      exists: true,
      directory: UPLOAD_DIR,
      files: files,
      count: files.length
    });

  } catch (error) {
    console.error('💥 Error verifying upload directory:', error);
    return NextResponse.json(
      { error: 'Failed to verify upload directory', details: error },
      { status: 500 }
    );
  }
}