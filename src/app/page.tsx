'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Store in sessionStorage for now (we'll use this in the analyze page)
        sessionStorage.setItem('uploadedImage', base64String);
        router.push('/analyze');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to ProofSnap.AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a screenshot or image to verify its authenticity and extract text.
            Our AI-powered analysis helps detect potential tampering and provides
            detailed verification reports.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <ImageUploader onImageUpload={handleImageUpload} />
          
          {isUploading && (
            <div className="mt-4 text-center text-gray-600">
              Processing your image...
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Image Analysis
            </h3>
            <p className="text-gray-600">
              Advanced algorithms detect potential image manipulation and tampering.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Text Extraction
            </h3>
            <p className="text-gray-600">
              Extract and verify text content from your images using OCR technology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              PDF Reports
            </h3>
            <p className="text-gray-600">
              Download detailed verification reports in PDF format for your records.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
