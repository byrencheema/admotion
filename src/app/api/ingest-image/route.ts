import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');

export async function POST(request: NextRequest) {
  try {
    console.log('🖼️ Image upload endpoint called');
    console.log('🖼️ Upload directory:', UPLOAD_DIR);

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      console.log('❌ No image file provided');
      console.log('🖼️ FormData entries:', Array.from(formData.entries()).map(([key, value]) => `${key}: ${value}`));
      return NextResponse.json(
        { error: 'No image file provided', success: false },
        { status: 400 }
      );
    }

    console.log('🖼️ File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid image type:', file.type);
      return NextResponse.json(
        { error: 'Invalid image type. Only JPG, PNG, GIF, WebP, and SVG are allowed.', success: false },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log('❌ Image too large:', file.size);
      return NextResponse.json(
        { error: 'Image too large. Maximum size is 10MB.', success: false },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
      console.log('📁 Created upload directory:', UPLOAD_DIR);
    }

    // Sanitize original filename
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Save file
    console.log('🖼️ Saving file to:', filePath);
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    await writeFile(filePath, buffer);
    console.log('🖼️ File saved successfully');

    const imageUrl = `/uploads/images/${fileName}`;
    
    console.log('✅ Image uploaded successfully:', {
      fileName,
      filePath,
      size: file.size,
      type: file.type,
      url: imageUrl
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      imageId: fileName,
      imageUrl: imageUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('💥 Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', success: false },
      { status: 500 }
    );
  }
}