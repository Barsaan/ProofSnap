'use client';

interface OCRDisplayProps {
  text: string;
}

export default function OCRDisplay({ text }: OCRDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Extracted Text</h2>
      <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
        {text || 'No text detected'}
      </pre>
    </div>
  );
} 