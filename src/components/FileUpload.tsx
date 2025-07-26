import React, { useRef, useState, useCallback } from "react";
import { cn } from "../lib/utils";

export interface FileUploadProps {
  onFileSelect: (file: File, fileId?: string) => void;
  accept?: string;
  disabled?: boolean;
  maxSize?: number;
  className?: string;
  uploadToServer?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "*/*",
  disabled = false,
  maxSize = 50 * 1024 * 1024, // 50MB default
  className,
  uploadToServer = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelection = useCallback(async (file: File) => {
    setError("");
    
    if (maxSize && file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }
    
    if (uploadToServer) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/ingest-file', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          onFileSelect(file, result.fileId);
        } else {
          setError(result.error || 'Failed to upload file');
        }
      } catch (err) {
        setError('Network error during upload');
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    } else {
      onFileSelect(file);
    }
  }, [onFileSelect, maxSize, uploadToServer]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  }, [handleFileSelection]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelection(file);
    }
  }, [disabled, handleFileSelection]);

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
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500",
          (disabled || uploading) && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl text-gray-400">📁</div>
          <div className="text-gray-900">
            <p className="text-lg font-medium">
              {uploading ? "Uploading..." : isDragOver ? "Drop file here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {accept !== "*/*" ? `Accepted formats: ${accept}` : "Any file type"}
            </p>
            {maxSize && (
              <p className="text-xs text-gray-400 mt-1">
                Max size: {Math.round(maxSize / 1024 / 1024)}MB
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
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  );
};