'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';

interface PDFExportButtonProps {
  reportId: string;
  verificationResult: {
    isTampered: boolean;
    confidence: number;
    metadata: {
      width: number;
      height: number;
      format: string;
      size: number;
    };
  };
  ocrText: string;
  imageUrl: string;
}

export default function PDFExportButton({
  reportId,
  verificationResult,
  ocrText,
  imageUrl,
}: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('ProofSnap.AI Verification Report', 20, 20);
      
      // Add report ID
      doc.setFontSize(12);
      doc.text(`Report ID: ${reportId}`, 20, 30);
      
      // Add verification result
      doc.setFontSize(14);
      doc.text('Verification Results:', 20, 40);
      doc.setFontSize(12);
      doc.text(`Status: ${verificationResult.isTampered ? 'Tampered' : 'Authentic'}`, 20, 50);
      doc.text(`Confidence: ${verificationResult.confidence}%`, 20, 60);
      
      // Add metadata
      doc.text('Image Metadata:', 20, 80);
      doc.text(`Dimensions: ${verificationResult.metadata.width}x${verificationResult.metadata.height}`, 20, 90);
      doc.text(`Format: ${verificationResult.metadata.format}`, 20, 100);
      doc.text(`Size: ${(verificationResult.metadata.size / 1024).toFixed(2)} KB`, 20, 110);
      
      // Add OCR text
      doc.text('Extracted Text:', 20, 130);
      const splitText = doc.splitTextToSize(ocrText, 170);
      doc.text(splitText, 20, 140);
      
      // Save the PDF
      doc.save(`proofsnap-report-${reportId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`px-6 py-2 rounded-lg font-medium text-white transition-colors
        ${isGenerating
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
        }`}
    >
      {isGenerating ? 'Generating PDF...' : 'Download PDF Report'}
    </button>
  );
} 