'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      // Add title
      doc.setFontSize(20);
      doc.text('ProofSnap.AI Verification Report', margin, 20);

      // Add report ID
      doc.setFontSize(12);
      doc.text(`Report ID: ${reportId}`, margin, 30);

      // Add verification status
      doc.setFontSize(14);
      doc.text(
        `Status: ${verificationResult.isTampered ? 'Potential Tampering Detected' : 'No Tampering Detected'}`,
        margin,
        40
      );

      // Add metadata
      doc.setFontSize(12);
      doc.text('Image Metadata:', margin, 50);
      doc.text(`Dimensions: ${verificationResult.metadata.width} x ${verificationResult.metadata.height}px`, margin, 60);
      doc.text(`Format: ${verificationResult.metadata.format.toUpperCase()}`, margin, 70);
      doc.text(`File Size: ${(verificationResult.metadata.size / 1024).toFixed(2)} KB`, margin, 80);
      doc.text(`Confidence: ${verificationResult.confidence}%`, margin, 90);

      // Add OCR text
      doc.setFontSize(12);
      doc.text('Extracted Text:', margin, 110);
      const splitText = doc.splitTextToSize(ocrText, pageWidth - 2 * margin);
      doc.text(splitText, margin, 120);

      // Add image
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (img.height * imgWidth) / img.width;
      doc.addImage(img, 'JPEG', margin, 150, imgWidth, imgHeight);

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