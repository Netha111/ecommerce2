'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { TRANSFORMATION_STYLES, TransformationStyleKey } from '@/app/types';

interface ImageUploadProps {
    onUpload: (file: File, style: TransformationStyleKey) => void;
    isProcessing: boolean;
    userCredits: number;
}

export default function ImageUpload({ onUpload, isProcessing, userCredits }: ImageUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<TransformationStyleKey>('studio-white');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size too large. Maximum 10MB allowed.');
            return;
        }

        setSelectedFile(file);
        
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile && userCredits >= 1) {
            onUpload(selectedFile, selectedStyle);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Transform Your Product Images</h2>
                <p className="text-gray-600">Upload an image and choose a transformation style</p>
            </div>

            {/* Credit Warning */}
            {userCredits < 1 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700">You need at least 1 credit to transform images. You have {userCredits} credits. Purchase more credits to continue.</p>
                    </div>
                </div>
            )}

            {/* File Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                        ? 'border-[#FF6B35] bg-orange-50' 
                        : selectedFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-[#FF6B35]'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                />

                {previewUrl ? (
                    <div className="space-y-4">
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="mx-auto max-h-48 rounded-lg shadow-sm"
                        />
                        <div>
                            <p className="text-sm text-gray-600 mb-2">{selectedFile?.name}</p>
                            <p className="text-xs text-gray-500">
                                {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={clearSelection}
                            className="text-red-600 text-sm hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            Drop your image here or click to browse
                        </p>
                        <p className="text-gray-600 mb-4">
                            Supports JPEG, PNG, WebP up to 10MB
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                        >
                            Choose File
                        </button>
                    </div>
                )}
            </div>

            {/* Style Selection */}
            {selectedFile && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Transformation Style</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(TRANSFORMATION_STYLES).map(([key, style]) => (
                            <label
                                key={key}
                                className={`cursor-pointer p-4 border-2 rounded-lg transition-colors ${
                                    selectedStyle === key
                                        ? 'border-[#FF6B35] bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="style"
                                    value={key}
                                    checked={selectedStyle === key}
                                    onChange={(e) => setSelectedStyle(e.target.value as TransformationStyleKey)}
                                    className="sr-only"
                                />
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">{style.name}</h4>
                                    <p className="text-sm text-gray-600">{style.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Button */}
            {selectedFile && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Cost: 1 credit • You have {userCredits} credits
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={isProcessing || userCredits < 1}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            isProcessing || userCredits < 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'
                        }`}
                    >
                        {isProcessing ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Transforming...
                            </div>
                        ) : (
                            'Transform Image'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
