import React, { useRef, useState, useCallback } from "react";
import { cn } from "../lib/utils";

export interface ImageUploadProps {
  onImageSelect: (image: File, previewUrl?: string, imageId?: string) => void;
  disabled?: boolean;
  maxSize?: number;
  className?: string;
  uploadToServer?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB default for images
  className,
  uploadToServer = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleImageSelection = useCallback(async (file: File) => {
    setError("");
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, GIF, WebP, SVG)');
      return;
    }
    
    // Validate file size
    if (maxSize && file.size > maxSize) {
      setError(`Image size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const previewUrl = e.target?.result as string;
      
      if (uploadToServer) {
        setUploading(true);
        try {
          console.log('🖼️ Uploading image to server:', file.name);
          const formData = new FormData();
          formData.append('image', file);
          
          const response = await fetch('/api/ingest-image', {
            method: 'POST',
            body: formData
          });
          
          const result = await response.json();
          
          if (result.success) {
            console.log('✅ Image uploaded successfully:', result.imageId);
            onImageSelect(file, previewUrl, result.imageId);
          } else {
            console.error('❌ Upload failed:', result.error);
            setError(result.error || 'Failed to upload image');
          }
        } catch (err) {
          console.error('💥 Network error during image upload:', err);
          setError('Network error during image upload');
        } finally {
          setUploading(false);
        }
      } else {
        onImageSelect(file, previewUrl);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, maxSize, uploadToServer]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelection(file);
    }
  }, [handleImageSelection]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageSelection(file);
    }
  }, [disabled, handleImageSelection]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, uploading]);

  return (
    <div className={cn("w-full", className)}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-150 ease-in-out",
          isDragOver
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-purple-500",
          (disabled || uploading) && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl text-gray-400">🖼️</div>
          <div className="text-gray-900">
            <p className="text-lg font-medium">
              {uploading ? "Uploading..." : isDragOver ? "Drop images here" : "Click to upload or drag and drop images"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported: JPG, PNG, GIF, WebP, SVG
            </p>
            {maxSize && (
              <p className="text-xs text-gray-400 mt-1">
                Max size: {Math.round(maxSize / 1024 / 1024)}MB per image
              </p>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  );
};