'use client';

import { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';

interface OCRDisplayProps {
  imageUrl: string;
  onOCRComplete: (text: string) => void;
}

export default function OCRDisplay({ imageUrl, onOCRComplete }: OCRDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performOCR = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const worker = await createWorker();
        
        // Perform OCR
        const result = await worker.recognize(imageUrl);
        
        // Clean up
        await worker.terminate();
        
        // Return results
        onOCRComplete(result.data.text);
      } catch (err) {
        setError('Failed to perform OCR. Please try again.');
        console.error('OCR Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (imageUrl) {
      performOCR();
    }
  }, [imageUrl, onOCRComplete]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Analyzing image... {Math.round(progress)}%
        </p>
      </div>
    );
  }

  return null;
} 