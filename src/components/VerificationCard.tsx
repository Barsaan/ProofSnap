'use client';

interface VerificationResult {
  isTampered: boolean;
  confidence: number;
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  analysis: {
    compressionScore: number;
    pixelConsistency: number;
    textAlignment: number;
    metadataScore: number;
  };
}

interface VerificationCardProps {
  result: VerificationResult;
  reportId: string;
}

export default function VerificationCard({ result, reportId }: VerificationCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Verification Results
        </h3>
        <span className="text-sm text-gray-500">Report ID: {reportId}</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${result.isTampered ? 'bg-red-500' : 'bg-green-500'}`} />
          <span className={`font-medium ${result.isTampered ? 'text-red-600' : 'text-green-600'}`}>
            {result.isTampered ? 'Potential Tampering Detected' : 'No Tampering Detected'}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Image Metadata
          </h4>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-gray-500">Dimensions</dt>
            <dd className="text-gray-900 truncate">{result.metadata.width} x {result.metadata.height}px</dd>
            
            <dt className="text-gray-500">Format</dt>
            <dd className="text-gray-900 truncate max-w-[120px]">
              {result.metadata.format.toUpperCase()}
            </dd>
            
            <dt className="text-gray-500">File Size</dt>
            <dd className="text-gray-900 truncate">{(result.metadata.size / 1024).toFixed(2)} KB</dd>
            
            <dt className="text-gray-500">Confidence</dt>
            <dd className={`font-medium ${getScoreColor(result.confidence)}`}>
              {result.confidence}%
            </dd>
          </dl>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Analysis Details
          </h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-gray-500">Compression Analysis</dt>
              <dd className={`font-medium ${getScoreColor(result.analysis.compressionScore)}`}>
                {result.analysis.compressionScore}%
              </dd>
            </div>
            
            <div className="flex justify-between items-center">
              <dt className="text-gray-500">Pixel Consistency</dt>
              <dd className={`font-medium ${getScoreColor(result.analysis.pixelConsistency)}`}>
                {result.analysis.pixelConsistency}%
              </dd>
            </div>
            
            <div className="flex justify-between items-center">
              <dt className="text-gray-500">Text Alignment</dt>
              <dd className={`font-medium ${getScoreColor(result.analysis.textAlignment)}`}>
                {result.analysis.textAlignment}%
              </dd>
            </div>
            
            <div className="flex justify-between items-center">
              <dt className="text-gray-500">Metadata Score</dt>
              <dd className={`font-medium ${getScoreColor(result.analysis.metadataScore)}`}>
                {result.analysis.metadataScore}%
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 