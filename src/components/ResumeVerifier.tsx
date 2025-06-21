import React, { useState } from 'react';
import { Upload, Shield, CheckCircle, AlertCircle, FileText, Blocks, Hash, Download } from 'lucide-react';
import { verifyResume, generateVerificationCertificate, ResumeVerificationResult } from '../utils/resumeVerifier';
import { addActivityLog, getCurrentUser } from '../utils/storage';

const ResumeVerifier: React.FC = () => {
  const [verificationStep, setVerificationStep] = useState<'upload' | 'processing' | 'verified'>('upload');
  const [verificationResult, setVerificationResult] = useState<ResumeVerificationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        alert('Please select a PDF file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setVerificationStep('processing');
    
    try {
      const result = await verifyResume(selectedFile);
      setVerificationResult(result);
      setVerificationStep('verified');
      
      // Log activity
      const user = getCurrentUser();
      if (user) {
        addActivityLog(
          user.id, 
          'resume_verify', 
          `Resume verified: ${selectedFile.name} - ${result.isAuthentic ? 'Authentic' : 'Questionable'}`
        );
      }
    } catch (error) {
      console.error('Error verifying resume:', error);
      alert('Error verifying resume. Please try again.');
      setVerificationStep('upload');
    }
  };

  const downloadCertificate = () => {
    if (!verificationResult) return;
    
    const certificate = generateVerificationCertificate(verificationResult);
    const blob = new Blob([certificate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_verification_${verificationResult.verificationId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetVerification = () => {
    setVerificationStep('upload');
    setVerificationResult(null);
    setSelectedFile(null);
  };

  if (verificationStep === 'upload') {
    return (
      <div className="p-8 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-4">Resume Verifier</h1>
            <p className="text-gray-400 text-lg">
              Blockchain-backed CV verification for authentic professional credentials
            </p>
          </div>

          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Upload Your Resume</h3>
                <p className="text-gray-400 mb-8">
                  Upload your CV to create a tamper-proof blockchain record
                </p>
                
                <div className="mb-6">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 cursor-pointer hover:border-cyan-400 transition-colors block"
                  >
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white font-medium">
                      {selectedFile ? selectedFile.name : 'Click to select your resume'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">PDF files only (Max 10MB)</p>
                  </label>
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-8 py-4 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify Resume
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6">How Resume Verification Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">1. Upload</h4>
                  <p className="text-gray-400 text-sm">
                    Upload your resume securely to our platform
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Hash className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">2. Analyze</h4>
                  <p className="text-gray-400 text-sm">
                    AI analyzes content for authenticity and consistency
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Blocks className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">3. Verify</h4>
                  <p className="text-gray-400 text-sm">
                    Store hash on blockchain for future verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStep === 'processing') {
    return (
      <div className="p-8 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Shield className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Analyzing Your Resume</h3>
            <p className="text-gray-400 mb-8">
              Our AI is checking for authenticity, consistency, and creating a blockchain record...
            </p>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-gray-500 text-sm">This may take a few moments...</p>
          </div>
        </div>
      </div>
    );
  }

  // Verified state
  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Success/Warning Message */}
          <div className={`rounded-xl p-8 border text-center ${
            verificationResult?.isAuthentic 
              ? 'bg-gray-900 border-green-500/30' 
              : 'bg-gray-900 border-yellow-500/30'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              verificationResult?.isAuthentic ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              {verificationResult?.isAuthentic ? (
                <CheckCircle className="w-10 h-10 text-white" />
              ) : (
                <AlertCircle className="w-10 h-10 text-white" />
              )}
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              {verificationResult?.isAuthentic 
                ? 'Resume Verified as Authentic!' 
                : 'Resume Authenticity Questionable'
              }
            </h3>
            <p className="text-gray-400 mb-8">
              {verificationResult?.isAuthentic
                ? 'Your resume has passed our authenticity checks and has been recorded on the blockchain'
                : 'Our analysis found some concerns with this resume. Please review the details below.'
              }
            </p>
            <div className="text-3xl font-bold mb-2">
              <span className={verificationResult?.isAuthentic ? 'text-green-400' : 'text-yellow-400'}>
                {verificationResult?.confidence}%
              </span>
            </div>
            <p className="text-gray-400">Confidence Score</p>
          </div>

          {/* Verification Details */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-6">Verification Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-gray-400">Document Hash:</span>
                  <span className="text-cyan-400 font-mono text-sm">{verificationResult?.hash.substring(0, 16)}...</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-gray-400">Verification ID:</span>
                  <span className="text-white">{verificationResult?.verificationId}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-gray-400">Verification Date:</span>
                  <span className="text-white">{new Date(verificationResult?.timestamp || '').toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-gray-400">Format Valid:</span>
                  <span className={verificationResult?.details.formatValid ? 'text-green-400' : 'text-red-400'}>
                    {verificationResult?.details.formatValid ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-gray-400">Credibility Score:</span>
                  <span className="text-white">{verificationResult?.details.contentAnalysis.credibilityScore}%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-gray-400">Issues Found:</span>
                  <span className={verificationResult?.issues.length === 0 ? 'text-green-400' : 'text-yellow-400'}>
                    {verificationResult?.issues.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Issues Found */}
          {verificationResult && verificationResult.issues.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6">Issues Detected</h3>
              <div className="space-y-3">
                {verificationResult.issues.map((issue, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Verification */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Share Your Verification</h3>
            <p className="text-gray-400 mb-6">
              Share this verification link with employers to prove the authenticity of your resume
            </p>
            <div className="flex space-x-4">
              <input
                type="text"
                value={`https://sentrivault.com/verify/${verificationResult?.hash}`}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm"
              />
              <button 
                onClick={() => navigator.clipboard.writeText(`https://sentrivault.com/verify/${verificationResult?.hash}`)}
                className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <button 
              onClick={resetVerification}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Verify Another Resume
            </button>
            <button 
              onClick={downloadCertificate}
              className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeVerifier;