import React, { useState } from 'react';
import { Upload, Shield, CheckCircle, AlertCircle, FileText, Blocks, Hash, Download, ExternalLink } from 'lucide-react';
import { verifyResume, generateVerificationCertificate, ResumeVerificationResult } from '../utils/resumeVerifier';
import { uploadToIPFS } from '../utils/ipfs';
import { storeResumeOnBlockchain, verifyResumeOnBlockchain } from '../utils/blockchain';
import { addActivityLog, getCurrentUser } from '../utils/storage';

const EnhancedResumeVerifier: React.FC = () => {
  const [verificationStep, setVerificationStep] = useState<'upload' | 'processing' | 'verified'>('upload');
  const [verificationResult, setVerificationResult] = useState<ResumeVerificationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [ipfsData, setIpfsData] = useState<any>(null);

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
      // Step 1: Verify resume content
      const result = await verifyResume(selectedFile);
      setVerificationResult(result);
      
      // Step 2: Upload to IPFS
      const ipfsResult = await uploadToIPFS(selectedFile);
      setIpfsData(ipfsResult);
      
      // Step 3: Store on blockchain
      try {
        const blockchainResult = await storeResumeOnBlockchain(ipfsResult.cid);
        setBlockchainData(blockchainResult);
      } catch (blockchainError) {
        console.warn('Blockchain storage failed, continuing with local verification:', blockchainError);
      }
      
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
    setBlockchainData(null);
    setIpfsData(null);
  };

  if (verificationStep === 'upload') {
    return (
      <div className="p-8 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent mb-4">
              Enhanced Resume Verifier
            </h1>
            <p className="text-gray-400 text-lg">
              Blockchain-backed CV verification with IPFS storage and AI analysis
            </p>
          </div>

          {/* Enhanced Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
              <Blocks className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Blockchain Storage</h3>
              <p className="text-gray-400 text-sm">Immutable verification on Ethereum</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
              <Hash className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">IPFS Integration</h3>
              <p className="text-gray-400 text-sm">Decentralized file storage</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-gray-400 text-sm">Advanced authenticity detection</p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Upload Your Resume</h3>
              <p className="text-gray-400 mb-8">
                Upload your CV to create a tamper-proof blockchain record with IPFS storage
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
                Verify & Store on Blockchain
              </button>
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
            <h3 className="text-2xl font-semibold text-white mb-4">Processing Your Resume</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Analyzing content with AI...</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Uploading to IPFS...</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Storing on blockchain...</span>
              </div>
            </div>
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
                ? 'Resume Verified & Stored!' 
                : 'Resume Processed with Concerns'
              }
            </h3>
            <p className="text-gray-400 mb-8">
              {verificationResult?.isAuthentic
                ? 'Your resume has been verified, stored on IPFS, and recorded on the blockchain'
                : 'Your resume has been processed but some authenticity concerns were detected'
              }
            </p>
            <div className="text-3xl font-bold mb-2">
              <span className={verificationResult?.isAuthentic ? 'text-green-400' : 'text-yellow-400'}>
                {verificationResult?.confidence}%
              </span>
            </div>
            <p className="text-gray-400">Confidence Score</p>
          </div>

          {/* Blockchain & IPFS Info */}
          {(blockchainData || ipfsData) && (
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6">Blockchain & IPFS Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ipfsData && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyan-400">IPFS Storage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span className="text-gray-400">IPFS CID:</span>
                        <span className="text-cyan-400 font-mono text-sm">{ipfsData.cid.substring(0, 16)}...</span>
                      </div>
                      <a 
                        href={ipfsData.ipfsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-gray-400">View on IPFS:</span>
                        <ExternalLink className="w-4 h-4 text-cyan-400" />
                      </a>
                    </div>
                  </div>
                )}
                
                {blockchainData && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-400">Blockchain Record</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span className="text-gray-400">Transaction:</span>
                        <span className="text-green-400 font-mono text-sm">{blockchainData.transactionHash?.substring(0, 16)}...</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span className="text-gray-400">Block Number:</span>
                        <span className="text-white">{blockchainData.blockNumber}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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

export default EnhancedResumeVerifier;