'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import OCRDisplay from '@/components/OCRDisplay';

export default function AnalyzePage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const storedImage = sessionStorage.getItem('uploadedImage');
    if (!storedImage) {
      router.push('/');
      return;
    }
    setImageUrl(storedImage);
  }, [router]);

  const handleOCRComplete = (text: string) => {
    setOcrText(text);
    setIsAnalyzing(false);
  };

  const handleVerify = () => {
    // Store OCR text in sessionStorage for the report page
    sessionStorage.setItem('ocrText', ocrText);
    router.push('/report');
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Image Analysis</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={imageUrl}
                  alt="Uploaded image"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">OCR Results</h2>
                {isAnalyzing ? (
                  <OCRDisplay imageUrl={imageUrl} onOCRComplete={handleOCRComplete} />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {ocrText || 'No text detected'}
                    </pre>
                  </div>
                )}
              </div>

              <button
                onClick={handleVerify}
                disabled={isAnalyzing}
                className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-colors
                  ${isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Verify Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 