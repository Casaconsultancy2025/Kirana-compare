
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, CameraIcon } from './Icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreview }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);
  
  return (
    <div className="bg-[#20183B]/60 p-6 rounded-2xl border border-purple-800/30 shadow-2xl shadow-purple-900/10 flex flex-col h-full">
      <div className="flex items-center gap-3 text-lg font-semibold text-gray-200 mb-4">
        <UploadIcon className="w-6 h-6 text-purple-400" />
        <span>Upload Product Image</span>
      </div>
      <div 
        className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-purple-800/50'}`}
        onDragEnter={onDragStart}
        onDragLeave={onDragEnd}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Product Preview" className="max-h-full max-w-full object-contain rounded-md p-2" />
        ) : (
          <div className="text-center text-gray-400">
            <CameraIcon className="w-16 h-16 mx-auto text-purple-600/50 mb-2" />
            <p className="font-semibold">Drag & drop your image here</p>
            <p className="my-2 text-sm">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-fuchsia-500/30 transform hover:scale-105 transition-all duration-300"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
