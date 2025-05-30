'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import { createWorker } from 'tesseract.js';

export default function AnalyzePage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageUrl(result);
      performOCR(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const performOCR = async (imageUrl: string) => {
    try {
      setIsAnalyzing(true);
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();
      setExtractedText(text);
    } catch (error) {
      console.error('OCR Error:', error);
      setExtractedText('Failed to extract text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVerify = () => {
    if (imageUrl && extractedText) {
      const params = new URLSearchParams({
        image: imageUrl,
        text: extractedText,
      });
      router.push(`/report?${params.toString()}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Analyze Image
          </h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>

            {imageUrl && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Preview</h2>
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={imageUrl}
                    alt="Uploaded image"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>
            )}

            {imageUrl && (
              <div>
                <h2 className="text-lg font-semibold mb-2">OCR Results</h2>
                {isAnalyzing ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {extractedText || 'No text detected'}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {imageUrl && extractedText && !isAnalyzing && (
              <button
                onClick={handleVerify}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Verify Now
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 