'use client';

import { useState } from 'react';

interface OCRDisplayProps {
  text: string;
}

export default function OCRDisplay({ text }: OCRDisplayProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Extracted Text</h2>
      {isProcessing ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
          {text || 'No text detected'}
        </pre>
      )}
    </div>
  );
} 