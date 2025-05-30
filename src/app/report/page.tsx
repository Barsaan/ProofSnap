'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import VerificationCard from '@/components/VerificationCard';
import PDFExportButton from '@/components/PDFExportButton';
import { verifyImage } from '@/utils/imageVerification';

export default function ReportPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [reportId] = useState(() => {
    // Generate a unique report ID using timestamp and random string
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  });

  useEffect(() => {
    const storedImage = sessionStorage.getItem('uploadedImage');
    const storedOcrText = sessionStorage.getItem('ocrText');

    if (!storedImage || !storedOcrText) {
      router.push('/');
      return;
    }

    setImageUrl(storedImage);
    setOcrText(storedOcrText);

    // Perform image verification
    const performVerification = async () => {
      try {
        setIsVerifying(true);
        const result = await verifyImage(storedImage);
        setVerificationResult(result);
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    performVerification();
  }, [router]);

  if (!imageUrl || !verificationResult) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {isVerifying ? 'Analyzing Image...' : 'Loading Report...'}
              </h1>
              {isVerifying && (
                <div className="w-full max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
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
            <PDFExportButton
              reportId={reportId}
              verificationResult={verificationResult}
              ocrText={ocrText}
              imageUrl={imageUrl}
            />
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
                  {ocrText || 'No text detected'}
                </pre>
              </div>
            </div>

            <div>
              <VerificationCard
                result={verificationResult}
                reportId={reportId}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 