'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import VerificationCard from '@/components/VerificationCard';
import PDFExportButton from '@/components/PDFExportButton';
import { verifyImage } from '@/utils/imageVerification';

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

interface VerificationResult {
  isTampered: boolean;
  confidence: number;
  metadata: ImageMetadata;
  analysis: {
    compressionScore: number;
    pixelConsistency: number;
    textAlignment: number;
    metadataScore: number;
  };
}

export default function ReportPage() {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [reportId] = useState(() => {
    // Generate a unique report ID using timestamp and random string
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  });

  useEffect(() => {
    const image = searchParams.get('image');
    const text = searchParams.get('text');
    if (image) {
      setImageUrl(image);
      setExtractedText(text || '');
      // Perform verification
      verifyImage(image).then((result) => {
        setVerificationResult(result);
      });
    }
  }, [searchParams]);

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No image selected</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Verification Report
            </h1>
            {verificationResult && (
              <PDFExportButton
                reportId={reportId}
                verificationResult={verificationResult}
                ocrText={extractedText}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={imageUrl}
                  alt="Analyzed image"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Extracted Text
                </h2>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {extractedText || 'No text detected'}
                </pre>
              </div>
            </div>

            <div>
              {verificationResult && (
                <VerificationCard
                  result={verificationResult}
                  reportId={reportId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 