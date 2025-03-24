
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

type FileUploadProps = {
  className?: string;
  onFileChange?: (file: File | null) => void;
  label?: string;
  accept?: string;
  supportedFormats?: string;
  maxSize?: number;
};

const FileUpload = ({ 
  className, 
  onFileChange, 
  label = "Upload file", 
  accept = "video/*, image/*",
  supportedFormats = "Supports PNG, JPG, GIF and video files",
  maxSize = 10 // in MB
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Size validation (MB to bytes)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }
    
    // Type validation based on accept prop
    if (accept === "image/*" && !file.type.startsWith("image/")) {
      setError("Only image files are accepted");
      return false;
    }
    
    // Clear previous errors
    setError(null);
    return true;
  };
  
  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, just show the filename
        setPreview(null);
      }
      if (onFileChange) onFileChange(file);
    } else {
      setFile(null);
      setPreview(null);
      if (onFileChange) onFileChange(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium text-foreground mb-2 block">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-lg",
          "transition-all duration-200 cursor-pointer overflow-hidden",
          dragActive 
            ? "border-primary bg-primary/5" 
            : "border-input bg-background/50 hover:bg-background",
          error && "border-destructive",
          preview && "border-solid",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={accept}
        />
        
        {preview ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain" 
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <p className="text-white font-medium">Change file</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="mb-2 text-sm text-foreground font-medium">
              Drag & drop a file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              {supportedFormats}
            </p>
            {error && (
              <p className="text-xs text-destructive mt-2">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
